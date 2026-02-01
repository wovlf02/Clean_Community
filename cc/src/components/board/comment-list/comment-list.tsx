'use client';

import type { Comment } from '@/types/comment';
import { CommentItem } from './comment-item';
import { CommentForm } from './comment-form';
import './comment-list.css';

interface CommentListProps {
  comments: Comment[];
  postId: string;
}

export function CommentList({ comments, postId }: CommentListProps) {
  return (
    <div className="comment-list">
      <h3 className="comment-list__title">댓글 {comments.length}개</h3>

      {/* 댓글 작성 폼 */}
      <CommentForm postId={postId} />

      {/* 댓글 목록 */}
      <div className="comment-list__items">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
