'use client';

import { Camera } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { UserAvatar } from '@/components/common/user-avatar';
import type { User } from '@/types/user';
import './profile-card.css';

interface ProfileCardProps {
  user: User;
  stats: {
    posts: number;
    friends: number;
    likes: number;
  };
  onAvatarEdit?: () => void;
}

export function ProfileCard({ user, stats, onAvatarEdit }: ProfileCardProps) {
  return (
    <Card className="profile-card">
      <div className="profile-card__avatar">
        <UserAvatar src={user.image} name={user.nickname} size="xl" />
        {onAvatarEdit && (
          <button
            type="button"
            className="profile-card__avatar-edit"
            onClick={onAvatarEdit}
            aria-label="프로필 이미지 수정"
          >
            <Camera className="h-4 w-4" />
          </button>
        )}
      </div>

      <h2 className="profile-card__name">{user.nickname}</h2>
      <p className="profile-card__email">{user.email}</p>
      {user.bio && <p className="profile-card__bio">{user.bio}</p>}

      <div className="profile-card__stats">
        <div className="profile-card__stat">
          <div className="profile-card__stat-value">{stats.posts}</div>
          <div className="profile-card__stat-label">게시글</div>
        </div>
        <div className="profile-card__stat">
          <div className="profile-card__stat-value">{stats.friends}</div>
          <div className="profile-card__stat-label">친구</div>
        </div>
        <div className="profile-card__stat">
          <div className="profile-card__stat-value">{stats.likes}</div>
          <div className="profile-card__stat-label">좋아요</div>
        </div>
      </div>
    </Card>
  );
}
