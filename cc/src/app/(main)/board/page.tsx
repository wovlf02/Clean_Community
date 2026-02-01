'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PostCard } from '@/components/board/post-card';
import { CategoryFilter } from '@/components/board/category-filter';
import { SortSelect } from '@/components/board/sort-select';
import { Pagination } from '@/components/common/pagination';
import { EmptyState } from '@/components/common/empty-state';
import { posts } from '@/mocks/posts';
import type { Post } from '@/types/post';
import './board.css';

const POSTS_PER_PAGE = 12;

export default function BoardPage() {
  const [category, setCategory] = useState<string>('all');
  const [sort, setSort] = useState<string>('latest');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 필터링 및 정렬
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // 카테고리 필터
    if (category !== 'all') {
      result = result.filter((post) => post.category === category);
    }

    // 검색 필터
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower)
      );
    }

    // 정렬
    switch (sort) {
      case 'popular':
        result.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case 'comments':
        result.sort((a, b) => b.commentCount - a.commentCount);
        break;
      case 'views':
        result.sort((a, b) => b.viewCount - a.viewCount);
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return result;
  }, [category, sort, search]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="board-page">
      {/* 헤더 */}
      <div className="board-page__header">
        <h1 className="board-page__title">게시판</h1>
        <Button asChild>
          <Link href="/board/write">
            <Plus className="mr-2 h-4 w-4" />
            글쓰기
          </Link>
        </Button>
      </div>

      {/* 필터 영역 */}
      <div className="board-page__filters">
        <CategoryFilter value={category} onChange={handleCategoryChange} />
        <div className="board-page__filter-right">
          <Input
            placeholder="검색..."
            value={search}
            onChange={handleSearch}
            leftIcon={<Search className="h-4 w-4" />}
            className="board-page__search"
          />
          <SortSelect value={sort} onChange={setSort} />
        </div>
      </div>

      {/* 게시글 그리드 */}
      {paginatedPosts.length > 0 ? (
        <>
          <div className="board-page__grid">
            {paginatedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <EmptyState
          title="게시글이 없습니다"
          description="첫 번째 게시글을 작성해보세요!"
          action={{
            label: '글쓰기',
            href: '/board/write',
          }}
        />
      )}
    </div>
  );
}
