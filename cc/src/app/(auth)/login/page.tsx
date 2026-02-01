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
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
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
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </button>
          <button className="login-page__social-btn" aria-label="Kakao 로그인">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 3C6.477 3 2 6.477 2 10.5c0 2.47 1.607 4.639 4.03 5.91-.127.462-.816 2.97-.845 3.166-.035.25.09.245.194.178.082-.05 3.065-2.098 4.303-2.943.73.11 1.482.189 2.318.189 5.523 0 10-3.477 10-7.5S17.523 3 12 3z"
              />
            </svg>
          </button>
          <button className="login-page__social-btn" aria-label="Naver 로그인">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"
              />
            </svg>
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
