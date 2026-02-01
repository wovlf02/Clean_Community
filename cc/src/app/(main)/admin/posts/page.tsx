'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash,
  Flag,
  MessageCircle,
  Heart,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserAvatar } from '@/components/common/user-avatar';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { showToast } from '@/lib/toast';
import '../admin.css';

// Mock 게시글 데이터
const mockPosts = [
  {
    id: '1',
    title: '오늘 날씨가 정말 좋네요!',
    content: '다들 좋은 하루 보내세요...',
    category: 'daily',
    author: { id: 'user-1', nickname: '김철수' },
    viewCount: 245,
    likeCount: 42,
    commentCount: 12,
    reportsCount: 0,
    status: 'published',
    createdAt: '2026-02-01T10:30:00Z',
  },
  {
    id: '2',
    title: 'React 18의 새로운 기능들',
    content: 'React 18에서 추가된 기능들을 정리해봤습니다...',
    category: 'info',
    author: { id: 'user-2', nickname: '이영희' },
    viewCount: 892,
    likeCount: 156,
    commentCount: 34,
    reportsCount: 0,
    status: 'published',
    createdAt: '2026-01-30T14:00:00Z',
  },
  {
    id: '3',
    title: '이상한 광고 게시글',
    content: '이 제품 정말 좋아요! 구매 링크...',
    category: 'general',
    author: { id: 'user-3', nickname: '스팸계정' },
    viewCount: 12,
    likeCount: 0,
    commentCount: 0,
    reportsCount: 5,
    status: 'flagged',
    createdAt: '2026-02-01T08:00:00Z',
  },
];

const categoryLabels: Record<string, string> = {
  general: '일반',
  qna: 'Q&A',
  info: '정보공유',
  daily: '일상',
};

const statusLabels: Record<string, string> = {
  published: '게시됨',
  flagged: '신고됨',
  hidden: '숨김',
  deleted: '삭제됨',
};

export default function AdminPostsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [posts, setPosts] = useState(mockPosts);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.author.nickname.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [posts, search, statusFilter]);

  const handleDelete = () => {
    if (!selectedPostId) return;
    setPosts((prev) => prev.filter((p) => p.id !== selectedPostId));
    showToast.success('삭제 완료', '게시글이 삭제되었습니다.');
    setShowDeleteDialog(false);
  };

  const handleHide = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: 'hidden' } : p))
    );
    showToast.success('숨김 처리', '게시글이 숨김 처리되었습니다.');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="admin-posts">
      {/* 헤더 */}
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">게시글 관리</h1>
          <p className="admin-page__description">
            게시글을 관리하고 부적절한 콘텐츠를 처리하세요
          </p>
        </div>
      </div>

      {/* 필터 */}
      <div className="admin-filters">
        <Input
          className="admin-search"
          placeholder="제목, 작성자 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              상태: {statusFilter === 'all' ? '전체' : statusLabels[statusFilter]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>
              전체
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter('published')}>
              게시됨
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('flagged')}>
              신고됨
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('hidden')}>
              숨김
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 테이블 */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>제목</th>
              <th>카테고리</th>
              <th>작성자</th>
              <th>조회</th>
              <th>좋아요</th>
              <th>댓글</th>
              <th>신고</th>
              <th>상태</th>
              <th>작성일</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id}>
                <td>
                  <span className="admin-posts__title">{post.title}</span>
                </td>
                <td>{categoryLabels[post.category]}</td>
                <td>
                  <div className="admin-posts__author">
                    <UserAvatar name={post.author.nickname} size="xs" />
                    {post.author.nickname}
                  </div>
                </td>
                <td>
                  <div className="admin-posts__stat">
                    <Eye className="h-3 w-3" />
                    {post.viewCount}
                  </div>
                </td>
                <td>
                  <div className="admin-posts__stat">
                    <Heart className="h-3 w-3" />
                    {post.likeCount}
                  </div>
                </td>
                <td>
                  <div className="admin-posts__stat">
                    <MessageCircle className="h-3 w-3" />
                    {post.commentCount}
                  </div>
                </td>
                <td>
                  <span className={post.reportsCount > 0 ? 'text-red-500 font-semibold' : ''}>
                    {post.reportsCount}
                  </span>
                </td>
                <td>
                  <span className={`admin-status-badge admin-status-badge--${post.status}`}>
                    {statusLabels[post.status]}
                  </span>
                </td>
                <td>{formatDate(post.createdAt)}</td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        상세 보기
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleHide(post.id)}>
                        <Flag className="mr-2 h-4 w-4" />
                        숨김 처리
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPostId(post.id);
                          setShowDeleteDialog(true);
                        }}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="admin-pagination">
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="h-4 w-4 mr-1" />
          이전
        </Button>
        <span className="admin-pagination__info">1 / 1 페이지</span>
        <Button variant="outline" size="sm" disabled>
          다음
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* 삭제 확인 */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="게시글 삭제"
        description="정말 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
