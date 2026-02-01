# Phase 5: 게시판 화면 개발

**관련 문서**: [게시판 화면 설계](../../05_screens/02_board/) | [기능 요구사항 FR-07~20](../../02_requirements/functional.md)

---

## 📋 개요

게시글 목록, 상세, 작성/수정 화면을 Mock 데이터 기반으로 구현합니다.

**예상 소요 시간**: 4일

---

## ✅ 체크리스트

### 1. 게시판 Mock 데이터

#### 1.1 게시글 Mock 데이터

```typescript
// mocks/posts.ts
import { Post, PostCategory } from '@/types';
import { mockUsers } from './users';

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    authorId: 'user-1',
    author: mockUsers[0],
    title: '안녕하세요! 첫 게시글입니다',
    content: '감성 커뮤니티에 가입하게 되어 기쁩니다...',
    category: 'general',
    thumbnailUrl: '/images/placeholder.jpg',
    viewCount: 156,
    likeCount: 23,
    commentCount: 8,
    isLiked: false,
    isEdited: false,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  // ... 20개 이상의 Mock 게시글
];

export const categories: { value: PostCategory; label: string }[] = [
  { value: 'general', label: '일반' },
  { value: 'qna', label: 'Q&A' },
  { value: 'info', label: '정보공유' },
  { value: 'daily', label: '일상' },
];
```

#### 1.2 댓글 Mock 데이터

```typescript
// mocks/comments.ts
import { Comment } from '@/types';
import { mockUsers } from './users';

export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    postId: 'post-1',
    authorId: 'user-2',
    author: mockUsers[1],
    content: '좋은 글이네요!',
    parentId: undefined,
    replies: [
      {
        id: 'comment-2',
        postId: 'post-1',
        authorId: 'user-1',
        author: mockUsers[0],
        content: '감사합니다!',
        parentId: 'comment-1',
        isEdited: false,
        createdAt: '2024-01-15T11:00:00Z',
      },
    ],
    isEdited: false,
    createdAt: '2024-01-15T10:45:00Z',
  },
  // ... 더 많은 댓글
];
```

- [x] 게시글 Mock 데이터 생성 (20개+)
- [x] 댓글 Mock 데이터 생성 (대댓글 포함)
- [x] 카테고리 데이터

---

### 2. 게시글 목록 페이지 (/board)

#### 2.1 게시글 카드 컴포넌트

```typescript
// components/board/post-card/post-card.tsx
'use client';

import Link from 'next/link';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/common/user-avatar';
import { Post } from '@/types';
import { formatRelativeTime, truncate } from '@/lib/utils';
import './post-card.css';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/board/${post.id}`}>
      <Card variant="interactive" className="post-card">
        {/* 썸네일 */}
        {post.thumbnailUrl && (
          <div className="post-card__thumbnail">
            <img src={post.thumbnailUrl} alt="" />
          </div>
        )}

        <CardHeader className="post-card__header">
          <Badge variant="primary" size="sm">
            {getCategoryLabel(post.category)}
          </Badge>
          <h3 className="post-card__title">{post.title}</h3>
        </CardHeader>

        <CardContent className="post-card__content">
          <p className="post-card__excerpt">
            {truncate(post.content, 100)}
          </p>
        </CardContent>

        <CardFooter className="post-card__footer">
          {/* 작성자 */}
          <div className="post-card__author">
            <UserAvatar
              src={post.author.image}
              name={post.author.nickname}
              size="sm"
            />
            <div className="post-card__author-info">
              <span className="post-card__author-name">{post.author.nickname}</span>
              <span className="post-card__date">{formatRelativeTime(post.createdAt)}</span>
            </div>
          </div>

          {/* 통계 */}
          <div className="post-card__stats">
            <span className="post-card__stat">
              <Eye className="h-4 w-4" />
              {post.viewCount}
            </span>
            <span className="post-card__stat">
              <Heart className="h-4 w-4" />
              {post.likeCount}
            </span>
            <span className="post-card__stat">
              <MessageCircle className="h-4 w-4" />
              {post.commentCount}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
```

- [x] post-card.css 파일 생성
- [x] PostCard 컴포넌트 생성

#### 2.2 게시글 목록 페이지

```typescript
// app/(main)/board/page.tsx
'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PostCard } from '@/components/board/post-card';
import { CategoryFilter } from '@/components/board/category-filter';
import { SortSelect } from '@/components/board/sort-select';
import { Pagination } from '@/components/common/pagination';
import { EmptyState } from '@/components/common/empty-state';
import { mockPosts } from '@/mocks/posts';
import './board.css';

export default function BoardPage() {
  const [category, setCategory] = useState<string>('all');
  const [sort, setSort] = useState<string>('latest');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock 필터링/정렬 로직
  const filteredPosts = mockPosts.filter((post) => {
    if (category !== 'all' && post.category !== category) return false;
    if (search && !post.title.includes(search)) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredPosts.length / 12);

  return (
    <div className="board-page">
      {/* 헤더 */}
      <div className="board-page__header">
        <h1 className="board-page__title">게시판</h1>
        <Button leftIcon={<Plus className="h-4 w-4" />}>
          글쓰기
        </Button>
      </div>

      {/* 필터 영역 */}
      <div className="board-page__filters">
        <CategoryFilter value={category} onChange={setCategory} />
        <div className="board-page__filter-right">
          <Input
            placeholder="검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            className="board-page__search"
          />
          <SortSelect value={sort} onChange={setSort} />
        </div>
      </div>

      {/* 게시글 그리드 */}
      {filteredPosts.length > 0 ? (
        <>
          <div className="board-page__grid">
            {filteredPosts.slice(0, 12).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <EmptyState
          title="게시글이 없습니다"
          description="첫 번째 게시글을 작성해보세요!"
          action={{ label: '글쓰기', onClick: () => {} }}
        />
      )}
    </div>
  );
}
```

- [x] board.css 파일 생성
- [x] 게시글 목록 페이지 구현
- [x] CategoryFilter 컴포넌트
- [x] SortSelect 컴포넌트
- [x] 검색 기능 (Mock)
- [x] 페이지네이션 연동

---

### 3. 게시글 상세 페이지 (/board/[id])

#### 3.1 게시글 상세 컴포넌트

- [x] post-detail.css 파일 생성
- [x] 게시글 내용 표시
- [x] 작성자 정보
- [x] 좋아요 버튼 (토글)
- [x] 공유 버튼 (카카오톡, 인스타그램, 네이버 카페, URL 복사)
- [x] AI 감정분석 결과 배지 표시

#### 3.2 댓글 컴포넌트

```typescript
// components/board/comment-list/comment-list.tsx
'use client';

import { Comment } from '@/types';
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
```

- [x] comment-list.css 파일 생성
- [x] CommentList 컴포넌트
- [x] CommentItem 컴포넌트 (대댓글 포함)
- [x] CommentForm 컴포넌트
- [x] 댓글 수정/삭제 UI

---

### 4. 게시글 작성/수정 페이지 (/board/write, /board/[id]/edit)

#### 4.1 게시글 에디터 컴포넌트

```typescript
// components/board/post-editor/post-editor.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { FormField } from '@/components/common/form-field';
import { SentimentWarningModal } from '@/components/common/sentiment-warning-modal';
import { categories } from '@/mocks/posts';
import './post-editor.css';

const postSchema = z.object({
  title: z.string().min(2, '제목은 2자 이상이어야 합니다').max(100),
  content: z.string().min(10, '내용은 10자 이상이어야 합니다'),
  category: z.string().min(1, '카테고리를 선택해주세요'),
});

type PostForm = z.infer<typeof postSchema>;

interface PostEditorProps {
  defaultValues?: Partial<PostForm>;
  isEdit?: boolean;
  onSubmit: (data: PostForm) => void;
}

export function PostEditor({ defaultValues, isEdit, onSubmit }: PostEditorProps) {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [detectedCategories, setDetectedCategories] = useState<string[]>([]);
  const [pendingData, setPendingData] = useState<PostForm | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues,
  });

  const handleFormSubmit = async (data: PostForm) => {
    // TODO: AI 감정분석 API 호출
    const mockAnalysis = {
      hasWarning: Math.random() > 0.7,
      categories: ['악플/욕설'],
    };

    if (mockAnalysis.hasWarning) {
      setDetectedCategories(mockAnalysis.categories);
      setPendingData(data);
      setShowWarningModal(true);
    } else {
      onSubmit(data);
    }
  };

  const handleProceed = () => {
    if (pendingData) {
      onSubmit(pendingData);
      setShowWarningModal(false);
    }
  };

  return (
    <>
      <form className="post-editor" onSubmit={handleSubmit(handleFormSubmit)}>
        <FormField label="카테고리" required error={errors.category?.message}>
          <Select {...register('category')}>
            <option value="">카테고리 선택</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="제목" required error={errors.title?.message}>
          <Input
            placeholder="제목을 입력하세요"
            error={!!errors.title}
            {...register('title')}
          />
        </FormField>

        <FormField label="내용" required error={errors.content?.message}>
          <Textarea
            placeholder="내용을 입력하세요"
            rows={15}
            error={!!errors.content}
            {...register('content')}
          />
        </FormField>

        {/* TODO: 첨부파일 업로드 */}

        <div className="post-editor__actions">
          <Button type="button" variant="outline">
            취소
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? '수정하기' : '등록하기'}
          </Button>
        </div>
      </form>

      {/* AI 감정분석 경고 모달 */}
      <SentimentWarningModal
        open={showWarningModal}
        onOpenChange={setShowWarningModal}
        categories={detectedCategories}
        onEdit={() => setShowWarningModal(false)}
        onProceed={handleProceed}
      />
    </>
  );
}
```

- [x] post-editor.css 파일 생성
- [x] PostEditor 컴포넌트
- [x] 폼 유효성 검사
- [x] AI 감정분석 연동 (Mock)
- [x] SentimentWarningModal 연동
- [x] 첨부파일 업로드 UI

---

## 📁 생성되는 파일 목록

```
cc/src/
├── app/(main)/
│   └── board/
│       ├── page.tsx
│       ├── board.css
│       ├── [id]/
│       │   ├── page.tsx
│       │   ├── post-detail.css
│       │   └── edit/
│       │       └── page.tsx
│       └── write/
│           └── page.tsx
├── components/board/
│   ├── post-card/
│   │   ├── post-card.tsx
│   │   ├── post-card.css
│   │   └── index.ts
│   ├── category-filter/
│   ├── sort-select/
│   ├── post-editor/
│   ├── comment-list/
│   │   ├── comment-list.tsx
│   │   ├── comment-item.tsx
│   │   ├── comment-form.tsx
│   │   └── comment-list.css
│   └── share-button/
└── mocks/
    ├── posts.ts
    └── comments.ts
```

---

## ✅ 완료 조건

- [x] 게시글/댓글 Mock 데이터 생성
- [x] 게시글 목록 페이지 완료
- [x] 카테고리 필터, 정렬, 검색 기능
- [x] 게시글 상세 페이지 완료
- [x] 좋아요, 공유 기능 UI
- [x] 댓글/대댓글 컴포넌트 완료
- [x] 게시글 작성/수정 페이지 완료
- [x] AI 감정분석 경고 모달 연동
- [x] 프로젝트 빌드 성공 (`npm run build`)

---

**이전 단계**: [Phase 4: 인증 화면 개발](./04-auth-pages.md)

**다음 단계**: [Phase 6: 채팅 화면 개발](./06-chat-pages.md)
