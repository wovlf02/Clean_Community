'use client';

import { useState } from 'react';
import { Edit, Trash, Flag, Copy } from 'lucide-react';
import type { Message } from '@/types/chat';
import { UserAvatar } from '@/components/common/user-avatar';
import { ReportModal } from '@/components/common/report-modal';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { showToast } from '@/lib/toast';
import './message-bubble.css';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  showSender?: boolean;
  participantCount?: number;
  currentUserId?: string;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
}

export function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  showSender = false,
  participantCount = 2,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const time = new Date(message.createdAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // 읽지 않은 참여자 수 계산 (본인 제외)
  const getUnreadCount = () => {
    if (message.isRead) return null;

    const readByCount = message.readBy?.length || 0;
    const unreadCount = participantCount - readByCount - 1;
    return unreadCount > 0 ? unreadCount : null;
  };

  const unreadCount = getUnreadCount();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      showToast.success('복사됨', '메시지가 클립보드에 복사되었습니다.');
    } catch {
      showToast.error('오류', '복사에 실패했습니다.');
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(message.id);
    } else {
      showToast.info('수정', '메시지 수정 기능이 준비 중입니다.');
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(message.id);
    }
    showToast.success('삭제됨', '메시지가 삭제되었습니다.');
    setShowDeleteDialog(false);
  };

  const messageContent = (
    <>
      {isOwn ? (
        // 내 메시지: 우측 정렬, 버블 좌측에 시간과 읽지않은수
        <div className="message-bubble message-bubble--own">
          <div className="message-bubble__meta message-bubble__meta--own">
            {unreadCount && (
              <span className="message-bubble__unread">{unreadCount}</span>
            )}
            <span className="message-bubble__time">{time}</span>
          </div>
          <div className="message-bubble__body">{message.content}</div>
        </div>
      ) : (
        // 상대방 메시지: 좌측 정렬, 버블 우측에 시간과 읽지않은수
        <div className="message-bubble message-bubble--other">
          <div className="message-bubble__avatar-wrapper">
            {showAvatar ? (
              <UserAvatar
                src={message.sender.image}
                name={message.sender.nickname}
                size="sm"
              />
            ) : (
              <div className="message-bubble__avatar-placeholder" />
            )}
          </div>

          <div className="message-bubble__content">
            {showAvatar && (
              <span className="message-bubble__sender">
                {message.sender.nickname}
              </span>
            )}

            <div className="message-bubble__row">
              <div className="message-bubble__body">{message.content}</div>

              <div className="message-bubble__meta message-bubble__meta--other">
                {unreadCount && (
                  <span className="message-bubble__unread">{unreadCount}</span>
                )}
                <span className="message-bubble__time">{time}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="메시지 삭제"
        description="정말 이 메시지를 삭제하시겠습니까?"
        confirmText="삭제"
        variant="destructive"
        onConfirm={handleDelete}
      />

      {/* 신고 모달 */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetType="chat_message"
        targetId={message.id}
        targetLabel={message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')}
      />
    </>
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="message-bubble-wrapper">
          {messageContent}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="message-context-menu">
        <ContextMenuItem onClick={handleCopy} className="message-context-menu__item">
          <Copy className="mr-2 h-4 w-4" />
          복사
        </ContextMenuItem>
        {isOwn && (
          <>
            <ContextMenuItem onClick={handleEdit} className="message-context-menu__item">
              <Edit className="mr-2 h-4 w-4" />
              수정
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="message-context-menu__item message-context-menu__item--danger"
            >
              <Trash className="mr-2 h-4 w-4" />
              삭제
            </ContextMenuItem>
          </>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => setShowReportModal(true)}
          className="message-context-menu__item message-context-menu__item--warning"
        >
          <Flag className="mr-2 h-4 w-4" />
          신고
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
