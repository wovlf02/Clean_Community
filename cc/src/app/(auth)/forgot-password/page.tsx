'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/common/form-field';
import { AuthLayout } from '@/components/layout/auth-layout';
import { showToast } from '@/lib/toast';
import './forgot-password.css';

type PageStep = 'email' | 'verify' | 'reset' | 'complete';

const emailSchema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
});

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        '영문, 숫자, 특수문자를 포함해야 합니다'
      ),
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  });

type EmailForm = z.infer<typeof emailSchema>;
type ResetForm = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<PageStep>('email');
  const [email, setEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(180);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  const resetForm = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  useEffect(() => {
    if (step === 'verify' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const onEmailSubmit = async (data: EmailForm) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setEmail(data.email);
    setCountdown(180);
    setStep('verify');
    showToast.success('인증번호 발송', '이메일로 인증번호를 발송했습니다.');
    setIsLoading(false);
  };

  const handleVerify = async () => {
    if (verifyCode.length !== 6) {
      setVerifyError('인증번호 6자리를 입력해주세요');
      return;
    }

    setIsLoading(true);
    setVerifyError('');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 123456을 유효한 인증번호로 가정
    if (verifyCode === '123456') {
      setStep('reset');
    } else {
      setVerifyError('인증번호가 일치하지 않습니다');
    }
    setIsLoading(false);
  };

  const handleResend = () => {
    setCountdown(180);
    showToast.success('인증번호 재발송', '인증번호가 다시 발송되었습니다.');
  };

  const onResetSubmit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStep('complete');
    showToast.success('비밀번호 변경 완료', '새 비밀번호로 로그인해주세요.');
    setIsLoading(false);
  };

  return (
    <AuthLayout>
      <div className="forgot-password-page">
        <div className="forgot-password-page__header">
          <h1 className="forgot-password-page__title">비밀번호 재설정</h1>
          <p className="forgot-password-page__subtitle">
            {step === 'email' && '가입한 이메일 주소를 입력해주세요'}
            {step === 'verify' && `${email}로 발송된 인증번호를 입력해주세요`}
            {step === 'reset' && '새로운 비밀번호를 설정해주세요'}
            {step === 'complete' && '비밀번호가 성공적으로 변경되었습니다'}
          </p>
        </div>

        {/* Step 1: 이메일 입력 */}
        {step === 'email' && (
          <form
            className="forgot-password-page__form"
            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
          >
            <FormField
              label="이메일"
              error={emailForm.formState.errors.email?.message}
              required
            >
              <Input
                type="email"
                placeholder="이메일을 입력하세요"
                error={!!emailForm.formState.errors.email}
                {...emailForm.register('email')}
              />
            </FormField>

            <Button type="submit" isLoading={isLoading} className="w-full">
              인증번호 발송
            </Button>
          </form>
        )}

        {/* Step 2: 인증번호 확인 */}
        {step === 'verify' && (
          <div className="forgot-password-page__form">
            <FormField
              label="인증번호"
              error={verifyError}
              description={`남은 시간: ${formatTime(countdown)}`}
              required
            >
              <Input
                type="text"
                placeholder="인증번호 6자리"
                maxLength={6}
                value={verifyCode}
                onChange={(e) =>
                  setVerifyCode(e.target.value.replace(/[^0-9]/g, ''))
                }
                error={!!verifyError}
              />
            </FormField>

            <p className="forgot-password-page__resend">
              인증번호를 받지 못하셨나요?{' '}
              <button
                type="button"
                className="forgot-password-page__resend-btn"
                onClick={handleResend}
                disabled={countdown > 170}
              >
                재발송
              </button>
            </p>

            <div className="forgot-password-page__actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('email')}
              >
                이전
              </Button>
              <Button
                type="button"
                onClick={handleVerify}
                isLoading={isLoading}
                disabled={countdown === 0}
              >
                확인
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: 새 비밀번호 설정 */}
        {step === 'reset' && (
          <form
            className="forgot-password-page__form"
            onSubmit={resetForm.handleSubmit(onResetSubmit)}
          >
            <FormField
              label="새 비밀번호"
              error={resetForm.formState.errors.password?.message}
              required
            >
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="새 비밀번호를 입력하세요"
                error={!!resetForm.formState.errors.password}
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
                {...resetForm.register('password')}
              />
            </FormField>

            <FormField
              label="비밀번호 확인"
              error={resetForm.formState.errors.passwordConfirm?.message}
              required
            >
              <Input
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="비밀번호를 다시 입력하세요"
                error={!!resetForm.formState.errors.passwordConfirm}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="cursor-pointer"
                  >
                    {showPasswordConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
                {...resetForm.register('passwordConfirm')}
              />
            </FormField>

            <Button type="submit" isLoading={isLoading} className="w-full">
              비밀번호 변경
            </Button>
          </form>
        )}

        {/* Step 4: 완료 */}
        {step === 'complete' && (
          <div className="forgot-password-page__complete">
            <div className="forgot-password-page__complete-icon">
              <CheckCircle className="h-8 w-8" />
            </div>
            <p className="forgot-password-page__complete-text">
              새 비밀번호로 로그인해주세요.
            </p>
            <Button onClick={() => router.push('/login')} className="w-full">
              로그인하기
            </Button>
          </div>
        )}

        <div className="forgot-password-page__links">
          <Link href="/login">로그인</Link>
          <span>|</span>
          <Link href="/register">회원가입</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
