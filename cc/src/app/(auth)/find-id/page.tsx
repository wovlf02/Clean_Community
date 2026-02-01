'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/common/form-field';
import { AuthLayout } from '@/components/layout/auth-layout';
import { showToast } from '@/lib/toast';
import './find-id.css';

const findIdSchema = z.object({
  name: z.string().min(2, '이름을 입력해주세요'),
  phone: z
    .string()
    .regex(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, '올바른 전화번호를 입력해주세요'),
});

type FindIdForm = z.infer<typeof findIdSchema>;

type PageStep = 'form' | 'result';

interface FoundUser {
  email: string;
  createdAt: string;
}

export default function FindIdPage() {
  const [step, setStep] = useState<PageStep>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [foundUser, setFoundUser] = useState<FoundUser | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FindIdForm>({
    resolver: zodResolver(findIdSchema),
  });

  const onSubmit = async (data: FindIdForm) => {
    setIsLoading(true);

    // Mock API 호출 (1초 딜레이)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock: 이름이 '홍길동'이면 아이디 찾기 성공
    if (data.name === '홍길동') {
      setFoundUser({
        email: 'test@example.com',
        createdAt: '2024-01-15',
      });
      setStep('result');
    } else {
      showToast.error('검색 실패', '일치하는 계정을 찾을 수 없습니다.');
    }

    setIsLoading(false);
  };

  return (
    <AuthLayout>
      <div className="find-id-page">
        <div className="find-id-page__header">
          <h1 className="find-id-page__title">아이디 찾기</h1>
          <p className="find-id-page__subtitle">
            {step === 'form'
              ? '가입 시 등록한 정보를 입력해주세요'
              : '아이디를 찾았습니다'}
          </p>
        </div>

        {step === 'form' && (
          <form className="find-id-page__form" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="이름" error={errors.name?.message} required>
              <Input
                type="text"
                placeholder="이름을 입력하세요"
                error={!!errors.name}
                {...register('name')}
              />
            </FormField>

            <FormField label="전화번호" error={errors.phone?.message} required>
              <Input
                type="tel"
                placeholder="010-0000-0000"
                error={!!errors.phone}
                {...register('phone')}
              />
            </FormField>

            <Button type="submit" isLoading={isLoading} className="w-full">
              아이디 찾기
            </Button>
          </form>
        )}

        {step === 'result' && foundUser && (
          <>
            <div className="find-id-page__result">
              <p className="find-id-page__result-label">등록된 이메일</p>
              <p className="find-id-page__result-email">{foundUser.email}</p>
              <p className="find-id-page__result-date">
                가입일: {foundUser.createdAt}
              </p>
            </div>

            <div className="find-id-page__actions">
              <Button variant="outline" asChild>
                <Link href="/forgot-password">비밀번호 찾기</Link>
              </Button>
              <Button asChild>
                <Link href="/login">로그인</Link>
              </Button>
            </div>
          </>
        )}

        <div className="find-id-page__links">
          <Link href="/login">로그인</Link>
          <span>|</span>
          <Link href="/register">회원가입</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
