# Phase 9: 설정 화면 개발

**관련 문서**: [설정 화면 설계](../../05_screens/06_settings/) | [기능 요구사항 FR-05~06](../../02_requirements/functional.md)

---

## 📋 개요

프로필, 설정, 비밀번호 변경, 계정 탈퇴, 약관 페이지를 구현합니다.

**예상 소요 시간**: 2일

---

## ✅ 체크리스트

### 1. 프로필 페이지 (/profile)

#### 1.1 프로필 카드 컴포넌트

```css
/* components/settings/profile-card/profile-card.css */

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
}

.profile-card__avatar {
  margin-bottom: 1rem;
  position: relative;
}

.profile-card__avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--primary));
  color: white;
  border-radius: 9999px;
  cursor: pointer;
  transition: opacity 150ms ease-out;
}

.profile-card__avatar-edit:hover {
  opacity: 0.9;
}

.profile-card__name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.profile-card__email {
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
  margin-bottom: 1rem;
}

.profile-card__bio {
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
  max-width: 300px;
  line-height: 1.5;
}

.profile-card__stats {
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgb(var(--border));
}

.profile-card__stat {
  text-align: center;
}

.profile-card__stat-value {
  font-size: 1.25rem;
  font-weight: 700;
}

.profile-card__stat-label {
  font-size: 0.75rem;
  color: rgb(var(--muted-foreground));
}
```

- [ ] profile-card.css 파일 생성
- [ ] ProfileCard 컴포넌트
- [ ] 프로필 이미지 수정 버튼
- [ ] 통계 표시 (게시글, 친구, 좋아요)

#### 1.2 프로필 수정 폼

- [ ] 닉네임 수정
- [ ] 자기소개 수정
- [ ] 프로필 이미지 업로드 (미리보기)

---

### 2. 설정 메인 페이지 (/settings)

```typescript
// app/(main)/settings/page.tsx
'use client';

import Link from 'next/link';
import {
  User,
  Lock,
  Bell,
  Moon,
  Shield,
  FileText,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import './settings.css';

const settingsGroups = [
  {
    title: '계정',
    items: [
      { href: '/profile', label: '프로필', icon: User },
      { href: '/settings/password', label: '비밀번호 변경', icon: Lock },
    ],
  },
  {
    title: '알림',
    items: [
      { href: '/settings/notifications', label: '알림 설정', icon: Bell },
    ],
  },
  {
    title: '정보',
    items: [
      { href: '/terms', label: '이용약관', icon: FileText },
      { href: '/privacy', label: '개인정보 처리방침', icon: Shield },
    ],
  },
  {
    title: '계정 관리',
    items: [
      {
        href: '/settings/delete-account',
        label: '계정 탈퇴',
        icon: Trash2,
        danger: true,
      },
    ],
  },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">설정</h1>

      {/* 다크 모드 토글 */}
      <Card className="settings-page__section">
        <CardContent className="settings-page__item">
          <div className="settings-page__item-left">
            <Moon className="h-5 w-5" />
            <span>다크 모드</span>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </CardContent>
      </Card>

      {/* 설정 그룹 */}
      {settingsGroups.map((group) => (
        <div key={group.title} className="settings-page__group">
          <h2 className="settings-page__group-title">{group.title}</h2>
          <Card>
            <CardContent className="settings-page__group-content">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`settings-page__link ${
                      item.danger ? 'settings-page__link--danger' : ''
                    }`}
                  >
                    <div className="settings-page__item-left">
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
```

- [ ] settings.css 파일 생성
- [ ] 설정 메인 페이지 구현
- [ ] 다크 모드 토글
- [ ] 설정 항목 링크

---

### 3. 비밀번호 변경 페이지 (/settings/password)

```typescript
// app/(main)/settings/password/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/common/form-field';
import { showToast } from '@/lib/toast';
import './change-password.css';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
    newPassword: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/,
        '영문, 숫자, 특수문자를 포함해야 합니다'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

export default function ChangePasswordPage() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordForm) => {
    // Mock API 호출
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showToast.success('비밀번호가 변경되었습니다');
    reset();
  };

  return (
    <div className="change-password-page">
      <Card>
        <CardHeader>
          <CardTitle>비밀번호 변경</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="change-password-form">
            <FormField
              label="현재 비밀번호"
              required
              error={errors.currentPassword?.message}
            >
              <Input
                type={showPasswords.current ? 'text' : 'password'}
                {...register('currentPassword')}
                error={!!errors.currentPassword}
              />
            </FormField>

            <FormField
              label="새 비밀번호"
              required
              error={errors.newPassword?.message}
              description="영문, 숫자, 특수문자를 포함한 8자 이상"
            >
              <Input
                type={showPasswords.new ? 'text' : 'password'}
                {...register('newPassword')}
                error={!!errors.newPassword}
              />
            </FormField>

            <FormField
              label="새 비밀번호 확인"
              required
              error={errors.confirmPassword?.message}
            >
              <Input
                type={showPasswords.confirm ? 'text' : 'password'}
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
              />
            </FormField>

            <Button type="submit" isLoading={isSubmitting} className="w-full">
              비밀번호 변경
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] change-password.css 파일 생성
- [ ] 비밀번호 변경 폼
- [ ] 비밀번호 유효성 검사

---

### 4. 계정 탈퇴 페이지 (/settings/delete-account)

- [ ] delete-account.css 파일 생성
- [ ] 탈퇴 경고 메시지
- [ ] 비밀번호 확인 입력
- [ ] 확인 모달

---

### 5. 이용약관 페이지 (/terms)

- [ ] 이용약관 내용 (마크다운 또는 정적)

---

### 6. 개인정보 처리방침 페이지 (/privacy)

- [ ] 개인정보 처리방침 내용

---

## 📁 생성되는 파일 목록

```
cc/src/
├── app/(main)/
│   ├── profile/
│   │   ├── page.tsx
│   │   └── profile.css
│   ├── settings/
│   │   ├── page.tsx
│   │   ├── settings.css
│   │   ├── password/
│   │   │   ├── page.tsx
│   │   │   └── change-password.css
│   │   ├── delete-account/
│   │   │   ├── page.tsx
│   │   │   └── delete-account.css
│   │   └── notifications/
│   │       └── page.tsx
│   ├── terms/
│   │   └── page.tsx
│   └── privacy/
│       └── page.tsx
└── components/settings/
    ├── profile-card/
    └── profile-edit-form/
```

---

## ✅ 완료 조건

- [ ] 프로필 페이지 완료
- [ ] 프로필 수정 기능
- [ ] 설정 메인 페이지 완료
- [ ] 다크 모드 토글 동작
- [ ] 비밀번호 변경 페이지 완료
- [ ] 계정 탈퇴 페이지 완료
- [ ] 이용약관/개인정보 처리방침 페이지 완료
- [ ] 프로젝트 빌드 성공 (`npm run build`)

---

**이전 단계**: [Phase 8: 대시보드 화면 개발](./08-dashboard-pages.md)

**다음 단계**: [Phase 10: 백엔드 API 구축](./10-backend-api.md)
