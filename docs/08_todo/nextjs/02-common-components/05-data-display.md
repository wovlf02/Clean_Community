# 02-5: 데이터 표시 컴포넌트 (Avatar, Badge, Pagination, EmptyState)

**상위 문서**: [README.md](./README.md)

---

## 📋 개요

데이터를 표시하는 Avatar, Badge, Pagination, EmptyState 컴포넌트를 구현합니다.

**예상 소요 시간**: 4시간

---

## ✅ 체크리스트

### 1. UserAvatar 컴포넌트

#### 1.1 UserAvatar CSS

```css
/* components/common/user-avatar/user-avatar.css */

.user-avatar {
  position: relative;
  display: inline-block;
}

/* 아바타 기본 */
.user-avatar__image {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 9999px;
  background-color: rgb(var(--muted));
}

/* 폴백 (이니셜) */
.user-avatar__fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgb(219 234 254); /* brand-100 */
  color: rgb(29 78 216); /* brand-700 */
  font-weight: 500;
}

/* 크기 변형 */
.user-avatar--sm .user-avatar__image {
  width: 2rem;
  height: 2rem;
  font-size: 0.75rem;
}

.user-avatar--md .user-avatar__image {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 0.875rem;
}

.user-avatar--lg .user-avatar__image {
  width: 3rem;
  height: 3rem;
  font-size: 1rem;
}

.user-avatar--xl .user-avatar__image {
  width: 4rem;
  height: 4rem;
  font-size: 1.25rem;
}

/* 온라인 상태 인디케이터 */
.user-avatar__status {
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 9999px;
  border: 2px solid rgb(var(--background));
}

.user-avatar--sm .user-avatar__status {
  width: 0.5rem;
  height: 0.5rem;
}

.user-avatar--md .user-avatar__status {
  width: 0.625rem;
  height: 0.625rem;
}

.user-avatar--lg .user-avatar__status {
  width: 0.75rem;
  height: 0.75rem;
}

.user-avatar--xl .user-avatar__status {
  width: 1rem;
  height: 1rem;
}

.user-avatar__status--online {
  background-color: rgb(34 197 94); /* success */
}

.user-avatar__status--offline {
  background-color: rgb(156 163 175); /* neutral-400 */
}

/* 호버 효과 (클릭 가능한 경우) */
.user-avatar--clickable {
  cursor: pointer;
}

.user-avatar--clickable:hover .user-avatar__image {
  opacity: 0.9;
  box-shadow: 0 0 0 2px rgb(var(--primary) / 0.3);
}

/* 다크 모드 */
:root.dark .user-avatar__fallback {
  background-color: rgb(30 58 138); /* brand-900 */
  color: rgb(191 219 254); /* brand-200 */
}
```

#### 1.2 UserAvatar 컴포넌트

```typescript
// components/common/user-avatar/user-avatar.tsx
'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import './user-avatar.css';

interface UserAvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  onClick?: () => void;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function UserAvatar({
  src,
  name,
  size = 'md',
  isOnline,
  onClick,
  className,
}: UserAvatarProps) {
  return (
    <div
      className={cn(
        'user-avatar',
        `user-avatar--${size}`,
        onClick && 'user-avatar--clickable',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <Avatar className="user-avatar__image">
        <AvatarImage src={src || undefined} alt={name} />
        <AvatarFallback className="user-avatar__fallback">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      
      {isOnline !== undefined && (
        <span
          className={cn(
            'user-avatar__status',
            isOnline ? 'user-avatar__status--online' : 'user-avatar__status--offline'
          )}
          aria-label={isOnline ? '온라인' : '오프라인'}
        />
      )}
    </div>
  );
}
```

- [x] user-avatar.css 파일 생성
- [x] user-avatar.tsx 파일 생성
- [x] 크기 변형 (sm, md, lg, xl)
- [x] 온라인 상태 인디케이터
- [x] 이니셜 폴백
- [x] 클릭 가능 상태 지원

---

### 2. Badge 컴포넌트 확장

#### 2.1 Badge CSS

```css
/* components/ui/badge/badge.css */

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  border-radius: 9999px;
  transition: all 150ms ease-out;
  white-space: nowrap;
}

/* 변형 */
.badge--default {
  background-color: rgb(var(--secondary));
  color: rgb(var(--secondary-foreground));
}

.badge--primary {
  background-color: rgb(219 234 254); /* brand-100 */
  color: rgb(29 78 216); /* brand-700 */
}

.badge--success {
  background-color: rgb(220 252 231); /* success-light */
  color: rgb(22 101 52); /* green-800 */
}

.badge--warning {
  background-color: rgb(254 243 199); /* warning-light */
  color: rgb(146 64 14); /* amber-800 */
}

.badge--danger {
  background-color: rgb(254 226 226); /* error-light */
  color: rgb(153 27 27); /* red-800 */
}

.badge--outline {
  background-color: transparent;
  border: 1px solid currentColor;
}

/* 크기 */
.badge--sm {
  padding: 0.125rem 0.5rem;
  font-size: 0.625rem;
}

.badge--lg {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

/* 클릭 가능한 배지 */
.badge--clickable {
  cursor: pointer;
}

.badge--clickable:hover {
  opacity: 0.8;
}

/* 닫기 버튼 있는 배지 */
.badge__close {
  margin-left: 0.25rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 150ms ease-out;
}

.badge__close:hover {
  opacity: 1;
}

/* 다크 모드 */
:root.dark .badge--primary {
  background-color: rgb(30 58 138);
  color: rgb(191 219 254);
}

:root.dark .badge--success {
  background-color: rgb(20 83 45);
  color: rgb(187 247 208);
}

:root.dark .badge--warning {
  background-color: rgb(120 53 15);
  color: rgb(253 230 138);
}

:root.dark .badge--danger {
  background-color: rgb(127 29 29);
  color: rgb(254 202 202);
}
```

#### 2.2 Badge 컴포넌트

```typescript
// components/ui/badge/badge.tsx
'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import './badge.css';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClose?: () => void;
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  onClose,
  children,
  onClick,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        'badge',
        `badge--${variant}`,
        size !== 'md' && `badge--${size}`,
        onClick && 'badge--clickable',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
      {onClose && (
        <X
          className="badge__close h-3 w-3"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="닫기"
        />
      )}
    </div>
  );
}
```

- [x] badge.css 파일 생성
- [x] badge.tsx 파일 생성
- [x] 변형 (primary, success, warning, danger, outline)
- [x] 크기 변형 (sm, md, lg)
- [x] 닫기 버튼 지원

---

### 3. Pagination 컴포넌트

#### 3.1 Pagination CSS

```css
/* components/common/pagination/pagination.css */

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

/* 페이지 버튼 */
.pagination__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  background-color: transparent;
  color: rgb(var(--foreground));
  transition: all 150ms ease-out;
  cursor: pointer;
}

.pagination__btn:hover:not(:disabled) {
  background-color: rgb(var(--accent));
}

.pagination__btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgb(var(--background)), 0 0 0 4px rgb(var(--ring));
}

.pagination__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 활성 페이지 */
.pagination__btn--active {
  background-color: rgb(var(--primary));
  color: rgb(var(--primary-foreground));
}

.pagination__btn--active:hover {
  background-color: rgb(var(--primary));
  opacity: 0.9;
}

/* 생략 부호 */
.pagination__ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  color: rgb(var(--muted-foreground));
}

/* 모바일 최적화 */
@media (max-width: 640px) {
  .pagination__btn {
    min-width: 2.25rem;
    height: 2.25rem;
    font-size: 0.75rem;
  }
  
  /* 모바일에서 일부 페이지 숨기기 */
  .pagination__btn--hide-mobile {
    display: none;
  }
}
```

#### 3.2 Pagination 컴포넌트

```typescript
// components/common/pagination/pagination.tsx
'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import './pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    pages.push(totalPages);
  }

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages);

  if (totalPages <= 1) return null;

  return (
    <nav
      className={cn('pagination', className)}
      role="navigation"
      aria-label="페이지 네비게이션"
    >
      {/* 이전 버튼 */}
      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* 페이지 번호 */}
      {pages.map((page, index) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="pagination__ellipsis">
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <button
            key={page}
            className={cn(
              'pagination__btn',
              currentPage === page && 'pagination__btn--active'
            )}
            onClick={() => onPageChange(page)}
            aria-label={`${page} 페이지`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* 다음 버튼 */}
      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
```

- [x] pagination.css 파일 생성
- [x] pagination.tsx 파일 생성
- [x] 페이지 번호 로직 (생략 부호 포함)
- [x] 접근성 속성 (aria-label, aria-current)
- [x] 모바일 반응형

---

### 4. EmptyState 컴포넌트

#### 4.1 EmptyState CSS

```css
/* components/common/empty-state/empty-state.css */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
}

/* 아이콘 */
.empty-state__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  margin-bottom: 1rem;
  border-radius: 9999px;
  background-color: rgb(var(--muted));
  color: rgb(var(--muted-foreground));
}

/* 제목 */
.empty-state__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(var(--foreground));
  margin-bottom: 0.25rem;
}

/* 설명 */
.empty-state__description {
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
  max-width: 20rem;
  line-height: 1.5;
}

/* 액션 버튼 */
.empty-state__action {
  margin-top: 1.5rem;
}

/* 변형: 작은 사이즈 */
.empty-state--compact {
  padding: 2rem 1rem;
}

.empty-state--compact .empty-state__icon {
  width: 3rem;
  height: 3rem;
}

.empty-state--compact .empty-state__title {
  font-size: 1rem;
}

.empty-state--compact .empty-state__description {
  font-size: 0.75rem;
}

/* 애니메이션 */
.empty-state__icon {
  animation: empty-state-bounce 2s ease-in-out infinite;
}

@keyframes empty-state-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
```

#### 4.2 EmptyState 컴포넌트

```typescript
// components/common/empty-state/empty-state.tsx
'use client';

import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import './empty-state.css';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  compact?: boolean;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'empty-state',
        compact && 'empty-state--compact',
        className
      )}
    >
      {Icon && (
        <div className="empty-state__icon">
          <Icon className="h-8 w-8" aria-hidden="true" />
        </div>
      )}
      
      <h3 className="empty-state__title">{title}</h3>
      
      {description && (
        <p className="empty-state__description">{description}</p>
      )}
      
      {action && (
        <div className="empty-state__action">
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
```

- [x] empty-state.css 파일 생성
- [x] empty-state.tsx 파일 생성
- [x] 아이콘, 제목, 설명, 액션 버튼 지원
- [x] compact 변형
- [x] 미세한 애니메이션 (bounce)

---

## ✅ 완료 조건

- [x] UserAvatar 컴포넌트 (CSS 분리) 완료
- [x] Badge 컴포넌트 확장 완료
- [x] Pagination 컴포넌트 완료
- [x] EmptyState 컴포넌트 완료
- [x] 모든 컴포넌트 배럴 파일 생성
- [x] 접근성 속성 적용
- [x] 모바일 반응형 확인
- [x] 프로젝트 빌드 성공

---

**이전**: [04-feedback.md](./04-feedback.md)

**상위 문서**: [README.md](./README.md)
