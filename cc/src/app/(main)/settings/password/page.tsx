'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Check, X, Info, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

// 비밀번호 강도 계산
function calculatePasswordStrength(password: string): { strength: 'weak' | 'fair' | 'good' | 'strong'; label: string } {
  if (!password) return { strength: 'weak', label: '' };

  let score = 0;

  // 길이 점수
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // 문자 다양성 점수
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[@$!%*#?&]/.test(password)) score += 1;

  if (score <= 2) return { strength: 'weak', label: '약함' };
  if (score <= 4) return { strength: 'fair', label: '보통' };
  if (score <= 5) return { strength: 'good', label: '양호' };
  return { strength: 'strong', label: '강함' };
}

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
    watch,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const newPassword = watch('newPassword') || '';
  const confirmPassword = watch('confirmPassword') || '';

  const passwordStrength = useMemo(() => calculatePasswordStrength(newPassword), [newPassword]);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordsDontMatch = newPassword && confirmPassword && newPassword !== confirmPassword;

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showToast.success('비밀번호가 변경되었습니다');
    reset();
  };

  const togglePassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const PasswordToggleButton = ({ field, isVisible }: { field: 'current' | 'new' | 'confirm'; isVisible: boolean }) => (
    <button
      type="button"
      onClick={() => togglePassword(field)}
      className={`password-toggle-btn ${isVisible ? 'password-toggle-btn--visible' : ''}`}
      aria-label={isVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
    >
      {isVisible ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </button>
  );

  return (
    <div className="change-password-page">
      <Card className="change-password-page__card">
        <CardHeader className="change-password-page__header">
          <div className="change-password-page__header-icon">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="change-password-page__title">비밀번호 변경</h1>
            <p className="change-password-page__subtitle">
              안전한 비밀번호로 계정을 보호하세요
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="change-password-form">
            {/* 안내 메시지 */}
            <div className="change-password-form__info">
              <Info className="h-4 w-4" />
              <span>영문, 숫자, 특수문자를 포함한 8자 이상의 비밀번호를 사용하세요.</span>
            </div>

            <FormField
              label="현재 비밀번호"
              required
              error={errors.currentPassword?.message}
            >
              <Input
                type={showPasswords.current ? 'text' : 'password'}
                placeholder="현재 비밀번호 입력"
                {...register('currentPassword')}
                error={!!errors.currentPassword}
                rightIcon={
                  <PasswordToggleButton field="current" isVisible={showPasswords.current} />
                }
              />
            </FormField>

            <FormField
              label="새 비밀번호"
              required
              error={errors.newPassword?.message}
            >
              <Input
                type={showPasswords.new ? 'text' : 'password'}
                placeholder="새 비밀번호 입력"
                {...register('newPassword')}
                error={!!errors.newPassword}
                rightIcon={
                  <PasswordToggleButton field="new" isVisible={showPasswords.new} />
                }
              />
              {/* 비밀번호 강도 표시기 */}
              {newPassword && (
                <div className="password-strength">
                  <div className="password-strength__bar">
                    <div className={`password-strength__fill password-strength__fill--${passwordStrength.strength}`} />
                  </div>
                  <div className="password-strength__text">
                    <span className="password-strength__label">비밀번호 강도</span>
                    <span className={`password-strength__value--${passwordStrength.strength}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </FormField>

            <FormField
              label="새 비밀번호 확인"
              required
              error={errors.confirmPassword?.message}
            >
              <Input
                type={showPasswords.confirm ? 'text' : 'password'}
                placeholder="새 비밀번호 다시 입력"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                rightIcon={
                  <PasswordToggleButton field="confirm" isVisible={showPasswords.confirm} />
                }
              />
              {/* 비밀번호 일치 표시 */}
              {passwordsMatch && (
                <div className="password-match password-match--matching">
                  <Check className="h-3.5 w-3.5" />
                  <span>비밀번호가 일치합니다</span>
                </div>
              )}
              {passwordsDontMatch && (
                <div className="password-match password-match--not-matching">
                  <X className="h-3.5 w-3.5" />
                  <span>비밀번호가 일치하지 않습니다</span>
                </div>
              )}
            </FormField>

            <div className="change-password-form__submit">
              <Button type="submit" isLoading={isSubmitting} className="w-full">
                <ShieldCheck className="h-4 w-4 mr-2" />
                비밀번호 변경
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
