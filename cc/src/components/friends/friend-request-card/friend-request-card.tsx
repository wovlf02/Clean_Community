'use client';

import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/common/user-avatar';
import { RelativeTime } from '@/components/common/relative-time';
import type { FriendRequest } from '@/types/friend';
import { showToast } from '@/lib/toast';
import './friend-request-card.css';

interface FriendRequestCardProps {
  request: FriendRequest;
}

export function FriendRequestCard({ request }: FriendRequestCardProps) {
  const handleAccept = () => {
    showToast.success('친구 수락', `${request.sender.nickname}님과 친구가 되었습니다.`);
  };

  const handleReject = () => {
    showToast.info('친구 거절', '친구 요청을 거절했습니다.');
  };

  return (
    <div className="friend-request-card">
      <UserAvatar
        src={request.sender.image}
        name={request.sender.nickname}
        isOnline={request.sender.isOnline}
      />

      <div className="friend-request-card__info">
        <p className="friend-request-card__name">{request.sender.nickname}</p>
        <RelativeTime date={request.createdAt} className="friend-request-card__time" />
      </div>

      <div className="friend-request-card__actions">
        <Button size="sm" onClick={handleAccept}>
          <Check className="mr-1 h-4 w-4" />
          수락
        </Button>
        <Button size="sm" variant="outline" onClick={handleReject}>
          <X className="mr-1 h-4 w-4" />
          거절
        </Button>
      </div>
    </div>
  );
}
