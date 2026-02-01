# 02-4: 피드백 컴포넌트 (Toast, Skeleton, Progress)

**상위 문서**: [README.md](./README.md)

---

## 📋 개요

사용자 피드백을 위한 Toast, Skeleton, Progress 컴포넌트를 구현합니다.

**예상 소요 시간**: 3시간

---

## ✅ 체크리스트

### 1. Toast 알림 (Sonner)

#### 1.1 Toaster 컴포넌트 CSS

```css
/* components/common/toaster/toaster.css */

/* Sonner 기본 스타일 오버라이드 */
[data-sonner-toaster] {
  --width: 360px;
  --border-radius: 0.75rem;
}

[data-sonner-toast] {
  padding: 1rem;
  gap: 0.75rem;
}

/* 성공 토스트 */
[data-sonner-toast][data-type="success"] {
  border-left: 4px solid rgb(34 197 94);
}

/* 에러 토스트 */
[data-sonner-toast][data-type="error"] {
  border-left: 4px solid rgb(239 68 68);
}

/* 경고 토스트 */
[data-sonner-toast][data-type="warning"] {
  border-left: 4px solid rgb(245 158 11);
}

/* 정보 토스트 */
[data-sonner-toast][data-type="info"] {
  border-left: 4px solid rgb(59 130 246);
}

/* 토스트 진입 애니메이션 */
[data-sonner-toast][data-mounted="true"] {
  animation: toast-enter 300ms ease-out;
}

@keyframes toast-enter {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 토스트 퇴장 애니메이션 */
[data-sonner-toast][data-removed="true"] {
  animation: toast-exit 200ms ease-in forwards;
}

@keyframes toast-exit {
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}
```

#### 1.2 Toaster 컴포넌트

```typescript
// components/common/toaster/toaster.tsx
'use client';

import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import './toaster.css';

export function Toaster() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SonnerToaster
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      position="top-right"
      expand={false}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast: 'bg-card border-border shadow-lg',
          title: 'text-foreground font-medium text-sm',
          description: 'text-muted-foreground text-xs',
          closeButton: 'bg-card border-border hover:bg-muted',
        },
      }}
    />
  );
}
```

- [x] toaster.css 파일 생성
- [x] toaster.tsx 파일 생성
- [x] 테마 연동 (다크 모드)
- [x] 애니메이션 추가

#### 1.3 Toast 유틸리티 함수

```typescript
// lib/toast.ts
import { toast } from 'sonner';

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },
  
  error: (message: string, description?: string) => {
    toast.error(message, { description });
  },
  
  warning: (message: string, description?: string) => {
    toast.warning(message, { description });
  },
  
  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },
  
  loading: (message: string) => {
    return toast.loading(message);
  },
  
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  },
  
  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },
  
  custom: (message: string, options?: { icon?: React.ReactNode }) => {
    toast(message, options);
  },
};
```

- [x] showToast 유틸리티 생성
- [x] promise 토스트 지원
- [x] RootLayout에 Toaster 추가

---

### 2. Skeleton 로딩 컴포넌트

#### 2.1 Skeleton 공통 CSS

```css
/* components/common/skeletons/skeletons.css */

/* 기본 스켈레톤 애니메이션 */
.skeleton {
  background: linear-gradient(
    90deg,
    rgb(var(--muted)) 25%,
    rgb(var(--muted-foreground) / 0.1) 50%,
    rgb(var(--muted)) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 펄스 변형 */
.skeleton--pulse {
  animation: skeleton-pulse 2s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

#### 2.2 게시글 카드 스켈레톤

```typescript
// components/common/skeletons/post-card-skeleton.tsx
'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import './skeletons.css';

export function PostCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* 썸네일 */}
      <Skeleton className="h-48 w-full rounded-none" />
      
      <CardHeader className="pb-2">
        {/* 카테고리 배지 */}
        <Skeleton className="h-5 w-16 rounded-full" />
        {/* 제목 */}
        <Skeleton className="h-6 w-4/5 mt-2" />
      </CardHeader>
      
      <CardContent className="pb-3">
        {/* 본문 미리보기 */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        {/* 작성자 정보 */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        
        {/* 통계 */}
        <div className="flex gap-3">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
        </div>
      </CardFooter>
    </Card>
  );
}
```

#### 2.3 채팅 메시지 스켈레톤

```typescript
// components/common/skeletons/message-skeleton.tsx
'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import './skeletons.css';

interface MessageSkeletonProps {
  isOwn?: boolean;
}

export function MessageSkeleton({ isOwn = false }: MessageSkeletonProps) {
  return (
    <div className={cn('flex gap-2', isOwn && 'flex-row-reverse')}>
      {/* 상대방 아바타 (내 메시지가 아닐 때만) */}
      {!isOwn && <Skeleton className="h-8 w-8 rounded-full shrink-0" />}
      
      <div className={cn('space-y-1', isOwn && 'items-end')}>
        {/* 메시지 버블 */}
        <Skeleton 
          className={cn(
            'h-10 rounded-2xl',
            isOwn ? 'w-40 rounded-br-sm' : 'w-48 rounded-bl-sm'
          )} 
        />
        {/* 시간 */}
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}
```

#### 2.4 프로필 스켈레톤

```typescript
// components/common/skeletons/profile-skeleton.tsx
'use client';

import { Skeleton } from '@/components/ui/skeleton';
import './skeletons.css';

export function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-4">
      {/* 프로필 이미지 */}
      <Skeleton className="h-16 w-16 rounded-full" />
      
      <div className="space-y-2">
        {/* 닉네임 */}
        <Skeleton className="h-5 w-32" />
        {/* 이메일/상태 */}
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}
```

#### 2.5 Skeleton 배럴 파일

```typescript
// components/common/skeletons/index.ts
export { PostCardSkeleton } from './post-card-skeleton';
export { MessageSkeleton } from './message-skeleton';
export { ProfileSkeleton } from './profile-skeleton';
```

- [x] skeletons.css 공통 스타일 생성
- [x] PostCardSkeleton 생성
- [x] MessageSkeleton 생성
- [x] ProfileSkeleton 생성
- [x] 배럴 파일 생성

---

### 3. Progress 컴포넌트

#### 3.1 Progress CSS

```css
/* components/ui/progress/progress.css */

.progress {
  position: relative;
  height: 0.5rem;
  width: 100%;
  overflow: hidden;
  border-radius: 9999px;
  background-color: rgb(var(--secondary));
}

.progress__indicator {
  height: 100%;
  width: 100%;
  flex: 1;
  background-color: rgb(var(--primary));
  transition: transform 500ms ease-out;
  border-radius: 9999px;
}

/* 무한 로딩 변형 */
.progress--indeterminate .progress__indicator {
  width: 50%;
  animation: progress-indeterminate 1.5s ease-in-out infinite;
}

@keyframes progress-indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

/* 크기 변형 */
.progress--sm {
  height: 0.25rem;
}

.progress--lg {
  height: 0.75rem;
}

/* 색상 변형 */
.progress--success .progress__indicator {
  background-color: rgb(34 197 94);
}

.progress--warning .progress__indicator {
  background-color: rgb(245 158 11);
}

.progress--error .progress__indicator {
  background-color: rgb(239 68 68);
}
```

#### 3.2 Progress 컴포넌트

```typescript
// components/ui/progress/progress.tsx
'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';
import './progress.css';

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  indeterminate?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, size = 'md', variant = 'default', indeterminate, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'progress',
      size !== 'md' && `progress--${size}`,
      variant !== 'default' && `progress--${variant}`,
      indeterminate && 'progress--indeterminate',
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="progress__indicator"
      style={!indeterminate ? { transform: `translateX(-${100 - (value || 0)}%)` } : undefined}
    />
  </ProgressPrimitive.Root>
));

Progress.displayName = 'Progress';

export { Progress };
```

- [x] progress.css 파일 생성
- [x] progress.tsx 파일 생성
- [x] indeterminate 변형 (무한 로딩)
- [x] 크기/색상 변형

---

## ✅ 완료 조건

- [x] Toaster 컴포넌트 완료
- [x] Toast 유틸리티 함수 완료
- [x] Skeleton 컴포넌트들 완료
- [x] Progress 컴포넌트 완료
- [x] 모든 애니메이션 동작 확인
- [x] RootLayout에 Toaster 추가
- [x] 프로젝트 빌드 성공

---

**이전**: [03-card-modal.md](./03-card-modal.md)

**다음**: [05-data-display.md](./05-data-display.md)
