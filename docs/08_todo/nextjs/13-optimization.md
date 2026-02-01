# Phase 13: 최적화 및 마무리

**관련 문서**: [비기능 요구사항](../../02_requirements/non-functional.md)

---

## 📋 개요

성능 최적화, SEO, 에러 처리, 최종 테스트를 진행하여 프로젝트를 마무리합니다.

**예상 소요 시간**: 2일

---

## ✅ 체크리스트

### 1. 이미지 최적화

#### 1.1 next/image 적용

```typescript
// 모든 이미지를 next/image로 교체
import Image from 'next/image';

// Before
<img src="/images/thumbnail.jpg" alt="썸네일" />

// After
<Image
  src="/images/thumbnail.jpg"
  alt="썸네일"
  width={400}
  height={225}
  className="post-card__thumbnail"
  priority={false}
/>
```

- [ ] 모든 `<img>` 태그를 `<Image>`로 교체
- [ ] priority 속성 설정 (LCP 이미지)
- [ ] sizes 속성 설정 (반응형)

#### 1.2 이미지 도메인 설정

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.ap-northeast-2.amazonaws.com',
        pathname: '/your-bucket/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google OAuth
      },
      {
        protocol: 'http',
        hostname: 'k.kakaocdn.net', // Kakao OAuth
      },
    ],
  },
};

export default nextConfig;
```

- [x] remotePatterns 설정
- [x] 외부 이미지 도메인 추가

---

### 2. 코드 스플리팅 및 Lazy Loading

#### 2.1 동적 임포트

```typescript
// 큰 컴포넌트 동적 로딩
import dynamic from 'next/dynamic';

// 차트 컴포넌트 (Recharts)
const ActivityChart = dynamic(
  () => import('@/components/dashboard/activity-chart').then((mod) => mod.ActivityChart),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false,
  }
);

// 에디터 컴포넌트 (리치 텍스트)
const RichTextEditor = dynamic(
  () => import('@/components/board/rich-text-editor'),
  { ssr: false }
);
```

- [ ] 차트 컴포넌트 동적 로딩
- [ ] 에디터 컴포넌트 동적 로딩
- [ ] 모달 컴포넌트 동적 로딩 (선택)

#### 2.2 React.lazy (클라이언트 컴포넌트)

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./heavy-component'));

function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

- [ ] 무거운 컴포넌트 lazy 로딩

---

### 3. 번들 크기 최적화

#### 3.1 번들 분석

```bash
npm install -D @next/bundle-analyzer

# next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# 분석 실행
ANALYZE=true npm run build
```

- [ ] Bundle Analyzer 설치 및 설정
- [ ] 번들 크기 분석

#### 3.2 불필요한 의존성 제거

- [ ] 사용하지 않는 패키지 제거
- [ ] 트리 쉐이킹 확인

#### 3.3 Import 최적화

```typescript
// Before (전체 라이브러리 import)
import * as Icons from 'lucide-react';

// After (필요한 아이콘만 import)
import { Home, User, Settings } from 'lucide-react';
```

- [ ] 아이콘 개별 import
- [ ] date-fns 개별 함수 import

---

### 4. SEO 메타 태그 설정

#### 4.1 루트 레이아웃 메타데이터

```typescript
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: '감성 커뮤니티',
    template: '%s | 감성 커뮤니티',
  },
  description: 'AI 기반 감정분석으로 건강한 소통 문화를 만드는 커뮤니티',
  keywords: ['커뮤니티', '소통', 'AI', '감정분석', '건강한 대화'],
  authors: [{ name: 'Emotion Community Team' }],
  creator: 'Emotion Community',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://your-domain.com',
    siteName: '감성 커뮤니티',
    title: '감성 커뮤니티',
    description: 'AI 기반 감정분석으로 건강한 소통 문화를 만드는 커뮤니티',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '감성 커뮤니티',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '감성 커뮤니티',
    description: 'AI 기반 감정분석으로 건강한 소통 문화를 만드는 커뮤니티',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

- [x] 기본 메타데이터 설정
- [x] Open Graph 설정
- [x] Twitter Card 설정

#### 4.2 동적 메타데이터 (게시글)

```typescript
// app/(main)/board/[id]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.id);

  return {
    title: post.title,
    description: post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 160),
      images: post.thumbnailUrl ? [post.thumbnailUrl] : [],
    },
  };
}
```

- [ ] 게시글 동적 메타데이터
- [ ] 프로필 동적 메타데이터

---

### 5. Error Boundary 구현

#### 5.1 전역 에러 페이지

```typescript
// app/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 (Sentry 등)
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h2 className="text-2xl font-bold">문제가 발생했습니다</h2>
      <p className="text-muted-foreground">
        잠시 후 다시 시도해주세요.
      </p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  );
}
```

#### 5.2 Not Found 페이지

```typescript
// app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <h2 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h2>
      <p className="text-muted-foreground">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  );
}
```

- [x] error.tsx 생성
- [x] not-found.tsx 생성
- [ ] 각 라우트별 에러 페이지 (선택)

---

### 6. Loading UI 최적화

#### 6.1 전역 로딩

```typescript
// app/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
```

#### 6.2 Suspense 적용

```typescript
// 서버 컴포넌트에서 데이터 fetching
import { Suspense } from 'react';
import { PostCardSkeleton } from '@/components/common/skeletons';

async function PostList() {
  const posts = await getPosts();
  return posts.map((post) => <PostCard key={post.id} post={post} />);
}

export default function BoardPage() {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      }
    >
      <PostList />
    </Suspense>
  );
}
```

- [x] loading.tsx 생성
- [x] Suspense 적용
- [x] 스켈레톤 UI 연결

---

### 7. Lighthouse 성능 점검

#### 7.1 성능 지표 목표

| 지표 | 목표 | 현재 |
|------|------|------|
| Performance | 90+ | - |
| Accessibility | 90+ | - |
| Best Practices | 90+ | - |
| SEO | 90+ | - |
| LCP | < 2.5s | - |
| FID | < 100ms | - |
| CLS | < 0.1 | - |

#### 7.2 점검 항목

- [ ] Lighthouse 성능 점수 확인
- [ ] LCP 최적화 (이미지 priority)
- [ ] FID 최적화 (JS 번들 최소화)
- [ ] CLS 최적화 (레이아웃 시프트 방지)
- [ ] 접근성 점검 (aria 속성, 색상 대비)

---

### 8. 최종 점검

#### 8.1 기능 테스트

- [ ] 회원가입/로그인/로그아웃
- [ ] 게시글 CRUD
- [ ] 댓글/대댓글
- [ ] 좋아요/공유
- [ ] 채팅 (실시간)
- [ ] 친구 관리
- [ ] 프로필 수정
- [ ] 다크 모드

#### 8.2 반응형 테스트

- [ ] Desktop (1440px+)
- [ ] Tablet (768px ~ 1023px)
- [ ] Mobile (< 768px)

#### 8.3 브라우저 테스트

- [ ] Chrome
- [ ] Safari
- [ ] Firefox
- [ ] Edge (선택)

#### 8.4 빌드 및 배포 준비

```bash
# 빌드 테스트
npm run build

# 프로덕션 실행 테스트
npm run start
```

- [ ] 프로덕션 빌드 성공
- [ ] 프로덕션 모드 테스트
- [ ] 환경 변수 확인

---

## 📁 생성/수정되는 파일 목록

```
cc/
├── app/
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── loading.tsx
│   └── layout.tsx (메타데이터 추가)
├── public/
│   ├── og-image.png
│   └── favicon.ico
└── next.config.ts (이미지 설정)
```

---

## ✅ 완료 조건

- [ ] next/image 적용 완료
- [ ] 코드 스플리팅 적용
- [ ] 번들 크기 최적화
- [x] SEO 메타 태그 설정
- [x] Error/NotFound 페이지 구현
- [x] Loading UI 최적화
- [ ] Lighthouse 90+ 달성
- [ ] 모든 기능 테스트 통과
- [ ] 반응형 테스트 통과
- [x] 프로덕션 빌드 성공

---

## 🎉 프로젝트 완료

모든 Phase를 완료하면 다음 기능이 구현된 상태입니다:

- ✅ 회원가입/로그인 (이메일 + OAuth)
- ✅ 게시판 (CRUD, 카테고리, 검색)
- ✅ 댓글/대댓글
- ✅ 좋아요/공유
- ✅ 실시간 채팅 (1:1, 그룹)
- ✅ 친구 관리
- ✅ 사용자 프로필
- ✅ 대시보드
- ✅ 설정
- ✅ AI 감정분석 연동
- ✅ 실시간 알림
- ✅ 다크 모드
- ✅ 반응형 디자인

---

**이전 단계**: [Phase 12: Socket 서버 연동](./12-socket-integration.md)

**메인 문서**: [README.md](./README.md)
