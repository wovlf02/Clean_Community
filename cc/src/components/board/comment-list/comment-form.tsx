'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/common/user-avatar';
import { currentUser } from '@/mocks/users';
import { showToast } from '@/lib/toast';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onCancel?: () => void;
  isReply?: boolean;
}

export function CommentForm({
  postId,
  parentId,
  onCancel,
  isReply = false,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      showToast.error('오류', '댓글 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    // Mock API 호출 (1초 딜레이)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    showToast.success('성공', '댓글이 등록되었습니다.');
    setContent('');
    setIsSubmitting(false);
    onCancel?.();
  };

  return (
    <div className={`comment-form ${isReply ? 'comment-form--reply' : ''}`}>
      {!isReply && (
        <div className="comment-form__avatar">
          <UserAvatar
            src={currentUser.image}
            name={currentUser.nickname}
            size="sm"
          />
        </div>
      )}

      <div className="comment-form__input-wrapper">
        <textarea
          className="comment-form__textarea"
          placeholder={isReply ? '답글을 입력하세요...' : '댓글을 입력하세요...'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={isReply ? 2 : 3}
        />
        <div className="comment-form__actions">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              취소
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!content.trim()}
          >
            {isReply ? '답글 등록' : '댓글 등록'}
          </Button>
        </div>
      </div>
    </div>
  );
}
