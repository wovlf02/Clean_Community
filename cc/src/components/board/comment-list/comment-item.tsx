'use client';

import { useState } from 'react';
import { MoreHorizontal, Edit, Trash, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/common/user-avatar';
import { RelativeTime } from '@/components/common/relative-time';
import { ReportModal } from '@/components/common/report-modal';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Comment } from '@/types/comment';
import { showToast } from '@/lib/toast';
import { CommentForm } from './comment-form';

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
}

export function CommentItem({ comment, isReply = false }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // 현재 사용자가 작성자인지 (실제로는 auth에서)
  const isAuthor = true;

  const handleDelete = () => {
    showToast.success('삭제 완료', `${isReply ? '답글' : '댓글'}이 삭제되었습니다.`);
    setShowDeleteDialog(false);
  };

  return (
    <div className={`comment-item ${isReply ? 'comment-item--reply' : ''}`}>
      <div className="comment-item__avatar">
        <UserAvatar
          src={comment.author.image}
          name={comment.author.nickname}
          size="sm"
        />
      </div>

      <div className="comment-item__content">
        <div className="comment-item__header">
          <div className="comment-item__author-info">
            <span className="comment-item__author-name">
              {comment.author.nickname}
            </span>
            <RelativeTime date={comment.createdAt} className="comment-item__date" />
            {comment.isEdited && (
              <span className="comment-item__edited">(수정됨)</span>
            )}
          </div>

          <div className="comment-item__actions">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="comment-dropdown">
                {isAuthor && (
                  <>
                    <DropdownMenuItem className="comment-dropdown__item">
                      <Edit className="mr-2 h-4 w-4" />
                      수정
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="comment-dropdown__item comment-dropdown__item--danger"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      삭제
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  onClick={() => setShowReportModal(true)}
                  className="comment-dropdown__item comment-dropdown__item--warning"
                >
                  <Flag className="mr-2 h-4 w-4" />
                  신고
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <p className="comment-item__body">{comment.content}</p>

        <div className="comment-item__footer">
          <button
            type="button"
            className="comment-item__reply-btn"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            답글
          </button>
        </div>

        {showReplyForm && (
          <CommentForm
            postId={comment.postId}
            parentId={comment.id}
            onCancel={() => setShowReplyForm(false)}
            isReply
          />
        )}

        {/* 대댓글 */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-item__replies">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={`${isReply ? '답글' : '댓글'} 삭제`}
        description={`정말 이 ${isReply ? '답글' : '댓글'}을 삭제하시겠습니까?`}
        confirmText="삭제"
        variant="destructive"
        onConfirm={handleDelete}
      />

      {/* 신고 모달 */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetType={isReply ? 'reply' : 'comment'}
        targetId={comment.id}
        targetLabel={comment.content.slice(0, 30) + (comment.content.length > 30 ? '...' : '')}
      />
    </div>
  );
}
