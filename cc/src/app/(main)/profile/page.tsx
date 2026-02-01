'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Edit, Mail, User, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/common/form-field';
import { UserAvatar } from '@/components/common/user-avatar';
import { currentUser } from '@/mocks/users';
import { showToast } from '@/lib/toast';
import './profile.css';

const profileSchema = z.object({
  nickname: z.string().min(2, '닉네임은 2자 이상이어야 합니다').max(20),
  bio: z.string().max(200, '자기소개는 200자까지 입력 가능합니다').optional(),
  name: z.string().min(2, '이름은 2자 이상이어야 합니다').max(50),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: currentUser.nickname,
      name: currentUser.name,
      bio: currentUser.bio || '',
    },
  });

  const onSubmit = async (_data: ProfileForm) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showToast.success('저장 완료', '프로필이 업데이트되었습니다.');
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const joinDate = new Date(currentUser.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="profile-page">
      {/* 페이지 헤더 */}
      <div className="profile-page__header">
        <h1 className="profile-page__title">내 프로필</h1>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            프로필 수정
          </Button>
        )}
      </div>

      {/* 프로필 카드 */}
      <Card className="profile-page__main-card">
        <CardContent className="profile-page__main-content">
          {/* 프로필 헤더 */}
          <div className="profile-page__profile-header">
            <UserAvatar
              src={currentUser.image}
              name={currentUser.nickname}
              size="xl"
              isOnline={currentUser.isOnline}
            />
            <div className="profile-page__profile-info">
              <h2 className="profile-page__name">{currentUser.name}</h2>
              <p className="profile-page__nickname">@{currentUser.nickname}</p>
              {currentUser.bio && (
                <p className="profile-page__bio">{currentUser.bio}</p>
              )}
            </div>
          </div>

          {/* 프로필 상세 정보 */}
          <div className="profile-page__details">
            <div className="profile-page__detail-item">
              <div className="profile-page__detail-icon">
                <User className="h-4 w-4" />
              </div>
              <div className="profile-page__detail-content">
                <span className="profile-page__detail-label">사용자 ID</span>
                <span className="profile-page__detail-value">{currentUser.id}</span>
              </div>
            </div>

            <div className="profile-page__detail-item">
              <div className="profile-page__detail-icon">
                <Mail className="h-4 w-4" />
              </div>
              <div className="profile-page__detail-content">
                <span className="profile-page__detail-label">이메일</span>
                <span className="profile-page__detail-value">{currentUser.email}</span>
              </div>
            </div>

            <div className="profile-page__detail-item">
              <div className="profile-page__detail-icon">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="profile-page__detail-content">
                <span className="profile-page__detail-label">가입일</span>
                <span className="profile-page__detail-value">{joinDate}</span>
              </div>
            </div>

            <div className="profile-page__detail-item">
              <div className="profile-page__detail-icon">
                <Shield className="h-4 w-4" />
              </div>
              <div className="profile-page__detail-content">
                <span className="profile-page__detail-label">계정 상태</span>
                <span className="profile-page__detail-value profile-page__detail-value--active">
                  활성
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 프로필 수정 폼 */}
      {isEditing && (
        <Card className="profile-page__edit-card">
          <CardHeader>
            <CardTitle>프로필 수정</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="profile-page__edit-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormField label="이름" error={errors.name?.message} required>
                <Input {...register('name')} error={!!errors.name} />
              </FormField>

              <FormField label="닉네임" error={errors.nickname?.message} required>
                <Input {...register('nickname')} error={!!errors.nickname} />
              </FormField>

              <FormField
                label="자기소개"
                error={errors.bio?.message}
                description="200자까지 입력 가능"
              >
                <Textarea {...register('bio')} rows={4} />
              </FormField>

              <div className="profile-page__actions">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  취소
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  저장
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
