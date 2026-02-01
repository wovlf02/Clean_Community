'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import {
  ArrowLeft,
  Heart,
  Share2,
  Edit,
  Trash,
  Eye,
  MessageCircle,
  MoreVertical,
  Flag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/common/user-avatar';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { ReportModal } from '@/components/common/report-modal';
import { CommentList } from '@/components/board/comment-list';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { posts } from '@/mocks/posts';
import { comments } from '@/mocks/comments';
import type { PostCategory } from '@/types/post';
import { formatDate, cn } from '@/lib/utils';
import { showToast } from '@/lib/toast';
import './post-detail.css';

const categoryLabels: Record<PostCategory, string> = {
  general: '일반',
  qna: 'Q&A',
  info: '정보공유',
  daily: '일상',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // 현재 사용자가 작성자인지 확인 (실제로는 auth에서 가져와야 함)
  const isAuthor = true; // 임시로 true로 설정

  // Mock 데이터에서 게시글 찾기
  const post = useMemo(() => {
    const found = posts.find((p) => p.id === id);
    if (found) {
      setIsLiked(found.isLiked);
      setLikeCount(found.likeCount);
    }
    return found;
  }, [id]);

  // 해당 게시글의 댓글 필터링
  const postComments = useMemo(() => {
    return comments.filter((c) => c.postId === id && !c.parentId);
  }, [id]);

  if (!post) {
    return (
      <div className="post-detail">
        <p>게시글을 찾을 수 없습니다.</p>
        <Button onClick={() => router.push('/board')}>목록으로</Button>
      </div>
    );
  }

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
      showToast.info('좋아요', '좋아요를 취소했습니다.');
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
      showToast.success('좋아요', '좋아요를 눌렀습니다.');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast.success('공유', 'URL이 클립보드에 복사되었습니다.');
    } catch {
      showToast.error('오류', 'URL 복사에 실패했습니다.');
    }
  };

  const handleDelete = () => {
    showToast.success('삭제 완료', '게시글이 삭제되었습니다.');
    setShowDeleteDialog(false);
    router.push('/board');
  };

  return (
    <div className="post-detail">
      {/* 뒤로가기 */}
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/board">
          <ArrowLeft className="mr-2 h-4 w-4" />
          목록으로
        </Link>
      </Button>

      {/* 헤더 */}
      <div className="post-detail__header">
        <div className="post-detail__header-top">
          <Badge variant="secondary" className="post-detail__category">
            {categoryLabels[post.category]}
          </Badge>

          {/* 점 3개 메뉴 버튼 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="post-detail__more-btn">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="post-detail__dropdown">
              {isAuthor && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={`/board/${post.id}/edit`} className="post-detail__dropdown-item">
                      <Edit className="mr-2 h-4 w-4" />
                      수정하기
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="post-detail__dropdown-item post-detail__dropdown-item--danger"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    삭제하기
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={() => setShowReportModal(true)}
                className="post-detail__dropdown-item post-detail__dropdown-item--warning"
              >
                <Flag className="mr-2 h-4 w-4" />
                신고하기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h1 className="post-detail__title">{post.title}</h1>

        <div className="post-detail__meta">
          <div className="post-detail__author">
            <UserAvatar
              src={post.author.image}
              name={post.author.nickname}
              size="md"
              isOnline={post.author.isOnline}
            />
            <div className="post-detail__author-info">
              <span className="post-detail__author-name">
                {post.author.nickname}
              </span>
              <span className="post-detail__date">
                {formatDate(post.createdAt)}
                {post.isEdited && ' (수정됨)'}
              </span>
            </div>
          </div>

          <div className="post-detail__stats">
            <span className="post-detail__stat">
              <Eye className="h-4 w-4" />
              {post.viewCount}
            </span>
            <span className="post-detail__stat">
              <Heart className="h-4 w-4" />
              {likeCount}
            </span>
            <span className="post-detail__stat">
              <MessageCircle className="h-4 w-4" />
              {postComments.length}
            </span>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="post-detail__content">{post.content}</div>

      {/* 액션 바 */}
      <div className="post-detail__actions">
        <div className="post-detail__action-left">
          <Button
            variant={isLiked ? 'default' : 'outline'}
            onClick={handleLike}
            className={cn(
              'post-detail__like-btn',
              isLiked && 'post-detail__like-btn--liked'
            )}
          >
            <Heart className="mr-2 h-4 w-4" />
            좋아요 {likeCount}
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            공유
          </Button>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="post-detail__comments">
        <CommentList comments={postComments} postId={post.id} />
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="게시글 삭제"
        description="정말 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        variant="destructive"
        onConfirm={handleDelete}
      />

      {/* 신고 모달 */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetType="post"
        targetId={post.id}
        targetLabel={post.title}
      />
    </div>
  );
}
