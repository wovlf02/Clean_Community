'use client';

import { useState } from 'react';
import { Check, X, UserPlus } from 'lucide-react';
import { UserAvatar } from '@/components/common/user-avatar';
import { RelativeTime } from '@/components/common/relative-time';
import type { FriendRequest } from '@/types/friend';
import { showToast } from '@/lib/toast';
import './friend-request-card.css';

interface FriendRequestCardProps {
  request: FriendRequest;
}

export function FriendRequestCard({ request }: FriendRequestCardProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isHandled, setIsHandled] = useState(false);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      showToast.success('친구 수락', `${request.sender.nickname}님과 친구가 되었습니다! 🎉`);
      setIsHandled(true);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      showToast.info('친구 거절', '친구 요청을 거절했습니다.');
      setIsHandled(true);
    } finally {
      setIsRejecting(false);
    }
  };

  if (isHandled) {
    return null;
  }

  return (
    <div className="friend-request-card">
      {/* 상단 그라디언트 바 */}
      <div className="friend-request-card__accent-bar" />

      <div className="friend-request-card__content">
        {/* 아바타 */}
        <div className="friend-request-card__avatar">
          <UserAvatar
            src={request.sender.image}
            name={request.sender.nickname}
            isOnline={request.sender.isOnline}
            size="lg"
          />
          <div className="friend-request-card__badge">
            <UserPlus className="h-3 w-3" />
          </div>
        </div>

        {/* 정보 */}
        <div className="friend-request-card__info">
          <p className="friend-request-card__name">{request.sender.nickname}</p>
          <p className="friend-request-card__desc">친구 요청을 보냈습니다</p>
          <RelativeTime date={request.createdAt} className="friend-request-card__time" />
        </div>

        {/* 액션 버튼 */}
        <div className="friend-request-card__actions">
          <button
            className="friend-request-card__btn friend-request-card__btn--accept"
            onClick={handleAccept}
            disabled={isAccepting || isRejecting}
          >
            {isAccepting ? (
              <span className="friend-request-card__spinner" />
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>수락</span>
              </>
            )}
          </button>
          <button
            className="friend-request-card__btn friend-request-card__btn--reject"
            onClick={handleReject}
            disabled={isAccepting || isRejecting}
          >
            {isRejecting ? (
              <span className="friend-request-card__spinner" />
            ) : (
              <>
                <X className="h-4 w-4" />
                <span>거절</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
