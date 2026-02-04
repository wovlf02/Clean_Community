'use client';

import { useState } from 'react';
import { MessageCircle, MoreVertical, UserMinus, Phone, Video, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/common/user-avatar';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Friend } from '@/types/friend';
import { showToast } from '@/lib/toast';
import './friend-card.css';

interface FriendCardProps {
  friend: Friend;
  onStartChat?: (friendId: string, friendNickname: string) => void;
}

export function FriendCard({ friend, onStartChat }: FriendCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemoveFriend = async () => {
    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      showToast.success('친구 삭제', `${friend.friend.nickname}님을 친구에서 삭제했습니다.`);
      setShowDeleteDialog(false);
    } catch {
      showToast.error('삭제 실패', '친구 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChatClick = () => {
    if (onStartChat) {
      onStartChat(friend.friendId, friend.friend.nickname);
    }
  };

  const handleVoiceCall = () => {
    showToast.info('음성 통화', `${friend.friend.nickname}님에게 음성 통화를 요청합니다.`);
  };

  const handleVideoCall = () => {
    showToast.info('영상 통화', `${friend.friend.nickname}님에게 영상 통화를 요청합니다.`);
  };

  return (
    <>
      <div className="friend-card">
        {/* 온라인 상태 인디케이터 */}
        <div className={`friend-card__status-bar ${friend.friend.isOnline ? 'friend-card__status-bar--online' : ''}`} />

        {/* 카드 헤더 - 더보기 버튼 */}
        <div className="friend-card__header">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="friend-card__more-btn">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="friend-card__dropdown">
              <DropdownMenuItem className="friend-card__dropdown-item" onClick={handleVoiceCall}>
                <Phone className="h-4 w-4" />
                <span>음성 통화</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="friend-card__dropdown-item" onClick={handleVideoCall}>
                <Video className="h-4 w-4" />
                <span>영상 통화</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="friend-card__dropdown-item">
                <UserCircle className="h-4 w-4" />
                <span>프로필 보기</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="friend-card__dropdown-item friend-card__dropdown-item--danger"
                onClick={() => setShowDeleteDialog(true)}
              >
                <UserMinus className="h-4 w-4" />
                <span>친구 삭제</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 카드 콘텐츠 */}
        <div className="friend-card__content">
          {/* 프로필 섹션 */}
          <div className="friend-card__profile">
            <UserAvatar
              src={friend.friend.image}
              name={friend.friend.nickname}
              isOnline={friend.friend.isOnline}
              size="lg"
            />
            <div className="friend-card__info">
              <p className="friend-card__name">{friend.friend.nickname}</p>
              <div className="friend-card__status">
                <span
                  className={`friend-card__status-dot ${
                    friend.friend.isOnline
                      ? 'friend-card__status-dot--online'
                      : 'friend-card__status-dot--offline'
                  }`}
                />
                <span className="friend-card__status-text">
                  {friend.friend.isOnline ? '온라인' : '오프라인'}
                </span>
              </div>
            </div>
          </div>

          {/* 액션 버튼 영역 */}
          <div className="friend-card__actions">
            <button className="friend-card__action-btn" onClick={handleVoiceCall} title="음성 통화">
              <Phone className="h-4 w-4" />
            </button>
            <button className="friend-card__action-btn" onClick={handleVideoCall} title="영상 통화">
              <Video className="h-4 w-4" />
            </button>
            <button className="friend-card__action-btn friend-card__action-btn--primary" onClick={handleChatClick} title="채팅">
              <MessageCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="친구 삭제"
        description={`정말 ${friend.friend.nickname}님을 친구 목록에서 삭제하시겠습니까? 삭제 후에도 기존 채팅 기록은 유지됩니다.`}
        confirmText="삭제"
        cancelText="취소"
        variant="destructive"
        onConfirm={handleRemoveFriend}
        disabled={isDeleting}
      />
    </>
  );
}
