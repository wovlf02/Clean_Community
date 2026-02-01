'use client';

import { useState } from 'react';
import { MessageCircle, MoreHorizontal, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/common/user-avatar';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
      // TODO: API 연동
      // await fetch(`/api/friends/${friend.id}`, { method: 'DELETE' });
      await new Promise((resolve) => setTimeout(resolve, 500)); // 임시 딜레이
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

  return (
    <>
      <div className="friend-card">
        <UserAvatar
          src={friend.friend.image}
          name={friend.friend.nickname}
          isOnline={friend.friend.isOnline}
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
            <span>{friend.friend.isOnline ? '온라인' : '오프라인'}</span>
          </div>
        </div>

        <div className="friend-card__actions">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleChatClick}
            className="friend-card__chat-btn"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="friend-card__delete-item"
                onClick={() => setShowDeleteDialog(true)}
              >
                <UserMinus className="mr-2 h-4 w-4" />
                친구 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="친구 삭제"
        description={`정말 ${friend.friend.nickname}님을 친구 목록에서 삭제하시겠습니까? 삭제 후에도 기존 채팅 기록은 유지됩니다.`}
        confirmText={isDeleting ? '삭제 중...' : '삭제'}
        cancelText="취소"
        variant="destructive"
        onConfirm={handleRemoveFriend}
        disabled={isDeleting}
      />
    </>
  );
}
