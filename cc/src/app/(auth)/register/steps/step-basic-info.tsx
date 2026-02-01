'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/common/form-field';

const basicInfoSchema = z
  .object({
    email: z.string().email('올바른 이메일 주소를 입력해주세요'),
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

type BasicInfoForm = z.infer<typeof basicInfoSchema>;

interface StepBasicInfoProps {
  onNext: (data: Partial<BasicInfoForm>) => void;
  defaultValues?: Partial<BasicInfoForm>;
}

export function StepBasicInfo({ onNext, defaultValues }: StepBasicInfoProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicInfoForm>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues,
  });

  const onSubmit = (data: BasicInfoForm) => {
    onNext(data);
  };

  return (
    <div className="register-step">
      <div className="register-page__header">
        <h1 className="register-page__title">회원가입</h1>
        <p className="register-page__subtitle">기본 정보를 입력해주세요</p>
      </div>

      <form className="register-step__form" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="이메일" error={errors.email?.message} required>
          <Input
            type="email"
            placeholder="이메일을 입력하세요"
            error={!!errors.email}
            {...register('email')}
          />
        </FormField>

        <FormField label="비밀번호" error={errors.password?.message} required>
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

        <FormField
          label="비밀번호 확인"
          error={errors.passwordConfirm?.message}
          required
        >
          <Input
            type={showPasswordConfirm ? 'text' : 'password'}
            placeholder="비밀번호를 다시 입력하세요"
            error={!!errors.passwordConfirm}
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
            {...register('passwordConfirm')}
          />
        </FormField>

        <div className="register-step__actions">
          <Button type="submit" className="w-full">
            다음
          </Button>
        </div>
      </form>
    </div>
  );
}
