'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/common/form-field';

const profileSchema = z.object({
  nickname: z
    .string()
    .min(2, '닉네임은 최소 2자 이상이어야 합니다')
    .max(20, '닉네임은 최대 20자까지 가능합니다')
    .regex(/^[가-힣a-zA-Z0-9_]+$/, '한글, 영문, 숫자, 밑줄만 사용 가능합니다'),
  name: z.string().min(2, '이름을 입력해주세요'),
  bio: z.string().max(100, '자기소개는 최대 100자까지 가능합니다').optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

interface StepProfileProps {
  onNext: (data: Partial<ProfileForm>) => void;
  onBack: () => void;
  defaultValues?: Partial<ProfileForm>;
}

export function StepProfile({ onNext, onBack, defaultValues }: StepProfileProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const bio = watch('bio') || '';

  const onSubmit = (data: ProfileForm) => {
    onNext(data);
  };

  return (
    <div className="register-step">
      <div className="register-page__header">
        <h1 className="register-page__title">프로필 설정</h1>
        <p className="register-page__subtitle">
          커뮤니티에서 사용할 프로필을 설정해주세요
        </p>
      </div>

      <form className="register-step__form" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="닉네임" error={errors.nickname?.message} required>
          <Input
            type="text"
            placeholder="닉네임을 입력하세요"
            error={!!errors.nickname}
            {...register('nickname')}
          />
        </FormField>

        <FormField label="이름" error={errors.name?.message} required>
          <Input
            type="text"
            placeholder="이름을 입력하세요"
            error={!!errors.name}
            {...register('name')}
          />
        </FormField>

        <FormField
          label="자기소개"
          error={errors.bio?.message}
          description={`${bio.length}/100`}
        >
          <Textarea
            placeholder="자기소개를 입력하세요 (선택)"
            rows={3}
            {...register('bio')}
          />
        </FormField>

        <div className="register-step__actions">
          <Button type="button" variant="outline" onClick={onBack}>
            이전
          </Button>
          <Button type="submit">다음</Button>
        </div>
      </form>
    </div>
  );
}
