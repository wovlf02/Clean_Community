# Phase 4: 인증 화면 개발

**관련 문서**: [인증 화면 설계](../../05_screens/01_auth/) | [기능 요구사항 FR-01~06](../../02_requirements/functional.md)

---

## 📋 개요

로그인, 회원가입, 아이디 찾기, 비밀번호 재설정 화면을 Mock 데이터 기반으로 구현합니다.

**예상 소요 시간**: 3일

**참고 문서**: 
- `docs/05_screens/01_auth/login-page.md`
- `docs/05_screens/01_auth/register-page.md`
- `docs/05_screens/01_auth/find-id-page.md`
- `docs/05_screens/01_auth/forgot-password-page.md`

---

## ✅ 체크리스트

### 1. 인증 Mock 데이터 및 스토어

#### 1.1 Mock 사용자 데이터

```typescript
// mocks/users.ts
import { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'test@example.com',
    nickname: '테스트유저',
    name: '홍길동',
    image: null,
    bio: '안녕하세요!',
    isOnline: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  // ... 더 많은 Mock 사용자
];

export const mockCurrentUser = mockUsers[0];
```

#### 1.2 Auth Store (Zustand)

```typescript
// store/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { mockCurrentUser } from '@/mocks/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: RegisterData) => Promise<boolean>;
  setUser: (user: User | null) => void;
}

interface RegisterData {
  email: string;
  password: string;
  nickname: string;
  name: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        
        // Mock 로그인 (1초 딜레이)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        if (email === 'test@example.com' && password === 'password123') {
          set({ user: mockCurrentUser, isAuthenticated: true, isLoading: false });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      register: async (data) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock 회원가입 성공
        const newUser: User = {
          id: `user-${Date.now()}`,
          ...data,
          image: null,
          bio: '',
          isOnline: true,
          createdAt: new Date().toISOString(),
        };
        
        set({ user: newUser, isAuthenticated: true, isLoading: false });
        return true;
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
```

- [ ] Mock 사용자 데이터 생성
- [ ] Auth Store 생성
- [ ] 로그인/로그아웃/회원가입 액션

---

### 2. 로그인 페이지 (/login)

#### 2.1 로그인 페이지 CSS

```css
/* app/(auth)/login/login.css */

.login-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.login-page__header {
  text-align: center;
}

.login-page__title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.login-page__subtitle {
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
}

/* 로그인 폼 */
.login-page__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 옵션 (자동 로그인, 비밀번호 찾기) */
.login-page__options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-page__remember {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.login-page__forgot {
  font-size: 0.875rem;
  color: rgb(var(--primary));
}

.login-page__forgot:hover {
  text-decoration: underline;
}

/* 구분선 */
.login-page__divider {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.login-page__divider-line {
  flex: 1;
  height: 1px;
  background-color: rgb(var(--border));
}

.login-page__divider-text {
  font-size: 0.75rem;
  color: rgb(var(--muted-foreground));
}

/* 소셜 로그인 */
.login-page__social {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.login-page__social-btn {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(var(--border));
  background-color: rgb(var(--background));
  cursor: pointer;
  transition: all 150ms ease-out;
}

.login-page__social-btn:hover {
  background-color: rgb(var(--accent));
  transform: translateY(-2px);
}

/* 회원가입 링크 */
.login-page__register {
  text-align: center;
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
}

.login-page__register a {
  color: rgb(var(--primary));
  font-weight: 500;
}

.login-page__register a:hover {
  text-decoration: underline;
}
```

#### 2.2 로그인 페이지 컴포넌트

```typescript
// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/common/form-field';
import { AuthLayout } from '@/components/layout/auth-layout';
import { useAuthStore } from '@/store/auth-store';
import { showToast } from '@/lib/toast';
import './login.css';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    const success = await login(data.email, data.password);
    
    if (success) {
      showToast.success('로그인 성공', '환영합니다!');
      router.push('/');
    } else {
      showToast.error('로그인 실패', '이메일 또는 비밀번호를 확인해주세요');
    }
  };

  return (
    <AuthLayout>
      <div className="login-page">
        {/* 헤더 */}
        <div className="login-page__header">
          <h1 className="login-page__title">로그인</h1>
          <p className="login-page__subtitle">계정에 로그인하세요</p>
        </div>

        {/* 로그인 폼 */}
        <form className="login-page__form" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="이메일" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="이메일을 입력하세요"
              error={!!errors.email}
              {...register('email')}
            />
          </FormField>

          <FormField label="비밀번호" error={errors.password?.message}>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력하세요"
              error={!!errors.password}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              {...register('password')}
            />
          </FormField>

          {/* 옵션 */}
          <div className="login-page__options">
            <label className="login-page__remember">
              <Checkbox
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
              />
              <span>자동 로그인</span>
            </label>
            <Link href="/forgot-password" className="login-page__forgot">
              비밀번호 찾기
            </Link>
          </div>

          {/* 로그인 버튼 */}
          <Button type="submit" isLoading={isLoading} className="w-full">
            로그인
          </Button>
        </form>

        {/* 구분선 */}
        <div className="login-page__divider">
          <div className="login-page__divider-line" />
          <span className="login-page__divider-text">또는</span>
          <div className="login-page__divider-line" />
        </div>

        {/* 소셜 로그인 */}
        <div className="login-page__social">
          <button className="login-page__social-btn" aria-label="Google 로그인">
            {/* Google 아이콘 */}
          </button>
          <button className="login-page__social-btn" aria-label="Kakao 로그인">
            {/* Kakao 아이콘 */}
          </button>
          <button className="login-page__social-btn" aria-label="Naver 로그인">
            {/* Naver 아이콘 */}
          </button>
        </div>

        {/* 회원가입 링크 */}
        <p className="login-page__register">
          아직 계정이 없으신가요? <Link href="/register">회원가입</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
```

- [ ] login.css 파일 생성
- [ ] 로그인 페이지 컴포넌트 생성
- [ ] 폼 유효성 검사 (react-hook-form + zod)
- [ ] 비밀번호 보기/숨기기 토글
- [ ] 소셜 로그인 UI (원형 아이콘)
- [ ] 로딩 상태 처리

---

### 3. 회원가입 페이지 (/register)

4단계 스텝으로 구성:
1. 기본 정보 입력
2. 이메일 인증
3. 프로필 설정
4. 약관 동의

#### 3.1 회원가입 스텝 컴포넌트

```typescript
// app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { AuthLayout } from '@/components/layout/auth-layout';
import { StepBasicInfo } from './steps/step-basic-info';
import { StepEmailVerify } from './steps/step-email-verify';
import { StepProfile } from './steps/step-profile';
import { StepTerms } from './steps/step-terms';
import './register.css';

type RegisterStep = 'basic' | 'verify' | 'profile' | 'terms';

interface RegisterData {
  email: string;
  password: string;
  nickname: string;
  name: string;
  bio: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
}

const stepLabels: Record<RegisterStep, string> = {
  basic: '기본 정보',
  verify: '이메일 인증',
  profile: '프로필',
  terms: '약관 동의',
};

const steps: RegisterStep[] = ['basic', 'verify', 'profile', 'terms'];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<RegisterStep>('basic');
  const [formData, setFormData] = useState<Partial<RegisterData>>({});

  const currentStepIndex = steps.indexOf(currentStep);

  const goToNextStep = (data: Partial<RegisterData>) => {
    setFormData({ ...formData, ...data });
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  return (
    <AuthLayout>
      <div className="register-page">
        {/* 스텝 인디케이터 */}
        <div className="register-page__steps">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`register-page__step ${
                index <= currentStepIndex ? 'register-page__step--active' : ''
              }`}
            >
              <div className="register-page__step-number">{index + 1}</div>
              <span className="register-page__step-label">{stepLabels[step]}</span>
            </div>
          ))}
        </div>

        {/* 스텝 컨텐츠 */}
        {currentStep === 'basic' && (
          <StepBasicInfo onNext={goToNextStep} defaultValues={formData} />
        )}
        {currentStep === 'verify' && (
          <StepEmailVerify
            email={formData.email || ''}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        )}
        {currentStep === 'profile' && (
          <StepProfile
            onNext={goToNextStep}
            onBack={goToPrevStep}
            defaultValues={formData}
          />
        )}
        {currentStep === 'terms' && (
          <StepTerms
            formData={formData}
            onBack={goToPrevStep}
          />
        )}
      </div>
    </AuthLayout>
  );
}
```

- [ ] register.css 파일 생성
- [ ] 스텝 인디케이터 UI
- [ ] StepBasicInfo 컴포넌트 (아이디, 비밀번호, 이메일)
- [ ] StepEmailVerify 컴포넌트 (이메일 인증번호 6자리)
- [ ] StepProfile 컴포넌트 (닉네임, 프로필 이미지)
- [ ] StepTerms 컴포넌트 (약관 동의)

---

### 4. 아이디 찾기 페이지 (/find-id)

- [ ] find-id.css 파일 생성
- [ ] 이메일 입력 폼
- [ ] 인증번호 발송 및 확인
- [ ] 아이디 표시 결과 화면

---

### 5. 비밀번호 재설정 페이지 (/forgot-password)

- [ ] forgot-password.css 파일 생성
- [ ] 이메일 입력 폼
- [ ] 인증번호 6자리 입력
- [ ] 새 비밀번호 설정 폼

---

## 📁 생성되는 파일 목록

```
cc/src/
├── app/
│   └── (auth)/
│       ├── layout.tsx
│       ├── login/
│       │   ├── page.tsx
│       │   └── login.css
│       ├── register/
│       │   ├── page.tsx
│       │   ├── register.css
│       │   └── steps/
│       │       ├── step-basic-info.tsx
│       │       ├── step-email-verify.tsx
│       │       ├── step-profile.tsx
│       │       └── step-terms.tsx
│       ├── find-id/
│       │   ├── page.tsx
│       │   └── find-id.css
│       └── forgot-password/
│           ├── page.tsx
│           └── forgot-password.css
├── mocks/
│   └── users.ts
└── store/
    └── auth-store.ts
```

---

## ✅ 완료 조건

- [ ] Mock 사용자 데이터 생성
- [ ] Auth Store 구현
- [ ] 로그인 페이지 완료
- [ ] 회원가입 페이지 (4단계 스텝) 완료
- [ ] 아이디 찾기 페이지 완료
- [ ] 비밀번호 재설정 페이지 완료
- [ ] 폼 유효성 검사 동작 확인
- [ ] 소셜 로그인 UI 완료 (기능은 백엔드 연동 시)
- [ ] 프로젝트 빌드 성공 (`npm run build`)

---

**이전 단계**: [Phase 3: 레이아웃 구현](./03-layouts.md)

**다음 단계**: [Phase 5: 게시판 화면 개발](./05-board-pages.md)
