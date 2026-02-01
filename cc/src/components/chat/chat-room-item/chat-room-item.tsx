'use client';

import { useState } from 'react';
import { LogOut, Bell, BellOff, Pin, Archive } from 'lucide-react';
import type { ChatRoom } from '@/types/chat';
import { UserAvatar } from '@/components/common/user-avatar';
import { RelativeTime } from '@/components/common/relative-time';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';
import { showToast } from '@/lib/toast';
import './chat-room-item.css';

interface ChatRoomItemProps {
  room: ChatRoom;
  currentUserId: string;
  isActive?: boolean;
  isSelected?: boolean;
  onLeave?: (roomId: string) => void;
}

export function ChatRoomItem({
  room,
  currentUserId,
  isActive,
  isSelected,
  onLeave,
}: ChatRoomItemProps) {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const otherParticipants = room.participants.filter(
    (p) => p.id !== currentUserId
  );

  const displayName =
    room.type === 'group'
      ? room.name
      : otherParticipants[0]?.nickname || '알 수 없음';

  const handleLeave = () => {
    if (onLeave) {
      onLeave(room.id);
    }
    showToast.success('채팅방 나가기', '채팅방에서 나갔습니다.');
    setShowLeaveDialog(false);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    showToast.info(
      isMuted ? '알림 켜짐' : '알림 꺼짐',
      isMuted ? '채팅방 알림이 켜졌습니다.' : '채팅방 알림이 꺼졌습니다.'
    );
  };

  const handlePinToggle = () => {
    setIsPinned(!isPinned);
    showToast.info(
      isPinned ? '고정 해제' : '고정됨',
      isPinned ? '채팅방 고정이 해제되었습니다.' : '채팅방이 상단에 고정되었습니다.'
    );
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              'chat-room-item',
              isActive && 'chat-room-item--active',
              isSelected && 'chat-room-item--selected',
              isPinned && 'chat-room-item--pinned'
            )}
          >
            {/* 아바타 */}
            <div className="chat-room-item__avatar">
              {room.type === 'direct' ? (
                <UserAvatar
                  src={otherParticipants[0]?.image}
                  name={otherParticipants[0]?.nickname || '?'}
                  isOnline={otherParticipants[0]?.isOnline}
                />
              ) : (
                <div className="chat-room-item__avatar--group">
                  {otherParticipants.slice(0, 2).map((p) => (
                    <UserAvatar key={p.id} src={p.image} name={p.nickname} size="sm" />
                  ))}
                </div>
              )}
            </div>

            {/* 내용 */}
            <div className="chat-room-item__content">
              <div className="chat-room-item__header">
                <span className="chat-room-item__name">
                  {isPinned && <Pin className="h-3 w-3 inline mr-1" />}
                  {isMuted && <BellOff className="h-3 w-3 inline mr-1 opacity-50" />}
                  {displayName}
                </span>
                {room.lastMessage && (
                  <RelativeTime
                    date={room.lastMessage.createdAt}
                    className="chat-room-item__time"
                  />
                )}
              </div>
              {room.lastMessage && (
                <p className="chat-room-item__message">{room.lastMessage.content}</p>
              )}
            </div>

            {/* 읽지 않은 메시지 수 */}
            {room.unreadCount > 0 && (
              <span className="chat-room-item__unread">
                {room.unreadCount > 99 ? '99+' : room.unreadCount}
              </span>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="chat-room-context-menu">
          <ContextMenuItem onClick={handlePinToggle} className="chat-room-context-menu__item">
            <Pin className="mr-2 h-4 w-4" />
            {isPinned ? '고정 해제' : '상단 고정'}
          </ContextMenuItem>
          <ContextMenuItem onClick={handleMuteToggle} className="chat-room-context-menu__item">
            {isMuted ? (
              <>
                <Bell className="mr-2 h-4 w-4" />
                알림 켜기
              </>
            ) : (
              <>
                <BellOff className="mr-2 h-4 w-4" />
                알림 끄기
              </>
            )}
          </ContextMenuItem>
          <ContextMenuItem className="chat-room-context-menu__item">
            <Archive className="mr-2 h-4 w-4" />
            보관함으로 이동
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => setShowLeaveDialog(true)}
            className="chat-room-context-menu__item chat-room-context-menu__item--danger"
          >
            <LogOut className="mr-2 h-4 w-4" />
            나가기
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* 나가기 확인 다이얼로그 */}
      <ConfirmDialog
        open={showLeaveDialog}
        onOpenChange={setShowLeaveDialog}
        title="채팅방 나가기"
        description={`"${displayName}" 채팅방에서 나가시겠습니까? 대화 내용이 삭제됩니다.`}
        confirmText="나가기"
        variant="destructive"
        onConfirm={handleLeave}
      />
    </>
  );
}
