# Phase 0: 프로젝트 초기 설정

**관련 문서**: [기술 스택](../../03_architecture/tech-stack.md) | [개발 환경 설정](../../06_development/setup.md)

---

## 📋 개요

Next.js 프로젝트의 기본 구조와 필수 패키지를 설정합니다.

**예상 소요 시간**: 1일

---

## ✅ 체크리스트

### 1. 필수 패키지 설치

> ⚠️ **패키지 매니저**: 시스템 안정성을 위해 **npm**을 사용합니다.
> npm은 Node.js에 기본 내장되어 있고 가장 오랜 기간 검증된 패키지 매니저입니다.

#### 1.1 스타일링 패키지
```bash
npm install tailwindcss postcss autoprefixer
npm install -D @tailwindcss/typography
```

- [ ] Tailwind CSS 설치
- [ ] PostCSS 설정
- [ ] Tailwind Typography 플러그인

#### 1.2 shadcn/ui 설정
```bash
npx shadcn@latest init
```

- [ ] shadcn/ui 초기화
- [ ] components.json 설정
- [ ] 기본 유틸리티 함수 (cn)

#### 1.3 상태 관리 패키지
```bash
npm install zustand @tanstack/react-query
```

- [ ] Zustand 설치
- [ ] React Query 설치
- [ ] QueryClient Provider 설정

#### 1.4 폼 관리 패키지
```bash
npm install react-hook-form zod @hookform/resolvers
```

- [ ] React Hook Form 설치
- [ ] Zod 스키마 검증 설치
- [ ] Hookform Zod Resolver 설치

#### 1.5 유틸리티 패키지
```bash
npm install lucide-react date-fns clsx tailwind-merge
npm install class-variance-authority
```

- [ ] Lucide Icons 설치
- [ ] date-fns 설치
- [ ] clsx + tailwind-merge 설치
- [ ] CVA (Class Variance Authority) 설치

#### 1.6 차트 패키지 (대시보드)
```bash
npm install recharts
```

- [ ] Recharts 설치

#### 1.7 Socket 클라이언트
```bash
npm install socket.io-client
```

- [ ] Socket.IO 클라이언트 설치

---

### 2. 프로젝트 폴더 구조 설정

```
cc/src/
├── app/                          # App Router
│   ├── (auth)/                   # 인증 관련 라우트 그룹
│   │   ├── login/
│   │   ├── register/
│   │   ├── find-id/
│   │   └── forgot-password/
│   ├── (main)/                   # 메인 레이아웃 라우트 그룹
│   │   ├── board/
│   │   ├── chat/
│   │   ├── friends/
│   │   ├── profile/
│   │   └── settings/
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   ├── users/
│   │   ├── posts/
│   │   ├── comments/
│   │   ├── chat/
│   │   ├── friends/
│   │   └── dashboard/
│   ├── layout.tsx
│   ├── page.tsx                  # 대시보드 (홈)
│   └── globals.css
│
├── components/                   # 컴포넌트
│   ├── ui/                       # shadcn/ui 기반 UI 컴포넌트
│   ├── common/                   # 공통 컴포넌트
│   ├── layout/                   # 레이아웃 컴포넌트
│   ├── auth/                     # 인증 관련 컴포넌트
│   ├── board/                    # 게시판 관련 컴포넌트
│   ├── chat/                     # 채팅 관련 컴포넌트
│   ├── friends/                  # 친구 관련 컴포넌트
│   ├── dashboard/                # 대시보드 관련 컴포넌트
│   └── settings/                 # 설정 관련 컴포넌트
│
├── hooks/                        # 커스텀 훅
│   ├── use-auth.ts
│   ├── use-posts.ts
│   ├── use-chat.ts
│   ├── use-socket.ts
│   └── use-media-query.ts
│
├── lib/                          # 유틸리티
│   ├── utils.ts                  # 공통 유틸 함수
│   ├── api.ts                    # API 클라이언트
│   ├── socket.ts                 # Socket.IO 클라이언트
│   └── validators.ts             # Zod 스키마
│
├── store/                        # Zustand 스토어
│   ├── auth-store.ts
│   ├── chat-store.ts
│   ├── notification-store.ts
│   └── ui-store.ts
│
├── mocks/                        # Mock 데이터
│   ├── users.ts
│   ├── posts.ts
│   ├── comments.ts
│   ├── chat-rooms.ts
│   ├── messages.ts
│   ├── friends.ts
│   ├── notifications.ts
│   └── index.ts
│
├── types/                        # TypeScript 타입
│   ├── user.ts
│   ├── post.ts
│   ├── comment.ts
│   ├── chat.ts
│   ├── friend.ts
│   ├── notification.ts
│   └── index.ts
│
├── providers/                    # Context Providers
│   ├── query-provider.tsx
│   ├── theme-provider.tsx
│   └── socket-provider.tsx
│
└── styles/                       # 추가 스타일
    └── fonts.css
```

- [ ] 폴더 구조 생성
- [ ] 각 폴더에 index.ts 배럴 파일 생성 (필요시)

---

### 3. 환경 변수 설정

#### 3.1 .env.local 파일 생성

```env
# ===========================================
# Next.js 환경 변수
# ===========================================

# App
NEXT_PUBLIC_APP_NAME="감성 커뮤니티"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# AI Server
NEXT_PUBLIC_AI_SERVER_URL="http://localhost:8000"

# Socket Server
NEXT_PUBLIC_SOCKET_SERVER_URL="http://localhost:4000"

# Database (백엔드 구축 시)
# DATABASE_URL="postgresql://postgres:password@localhost:5432/emotion_community"

# NextAuth (백엔드 구축 시)
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="your-secret-key-here"

# OAuth (백엔드 구축 시)
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
# KAKAO_CLIENT_ID=""
# KAKAO_CLIENT_SECRET=""
# NAVER_CLIENT_ID=""
# NAVER_CLIENT_SECRET=""

# AWS S3 (백엔드 구축 시)
# AWS_REGION="ap-northeast-2"
# AWS_ACCESS_KEY_ID=""
# AWS_SECRET_ACCESS_KEY=""
# S3_BUCKET_NAME=""
```

- [ ] .env.local 파일 생성
- [ ] .env.example 파일 생성 (버전 관리용)
- [ ] .gitignore에 .env.local 확인

---

### 4. TypeScript 경로 별칭 설정

#### 4.1 tsconfig.json 수정

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/store/*": ["./src/store/*"],
      "@/mocks/*": ["./src/mocks/*"],
      "@/types/*": ["./src/types/*"],
      "@/providers/*": ["./src/providers/*"]
    }
  }
}
```

- [ ] 경로 별칭 설정
- [ ] 별칭 동작 확인

---

### 5. ESLint/Prettier 설정 보완

#### 5.1 Prettier 설정 (.prettierrc)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

- [ ] Prettier 설치: `npm install -D prettier prettier-plugin-tailwindcss`
- [ ] .prettierrc 파일 생성
- [ ] package.json에 format 스크립트 추가

#### 5.2 ESLint 규칙 추가

- [ ] React Query 린트 규칙 추가 (선택)
- [ ] import 정렬 규칙 추가 (선택)

---

### 6. Mock 데이터 구조 설계

#### 6.1 기본 타입 정의 (types/)

```typescript
// types/user.ts
export interface User {
  id: string;
  email: string;
  nickname: string;
  name: string;
  image?: string;
  bio?: string;
  isOnline: boolean;
  createdAt: string;
}

// types/post.ts
export interface Post {
  id: string;
  authorId: string;
  author: User;
  title: string;
  content: string;
  category: PostCategory;
  thumbnailUrl?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PostCategory = 'general' | 'qna' | 'info' | 'daily';

// types/comment.ts
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  parentId?: string;
  replies?: Comment[];
  isEdited: boolean;
  createdAt: string;
}

// types/chat.ts
export interface ChatRoom {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  sender: User;
  content: string;
  type: 'text' | 'image' | 'emoji';
  isRead: boolean;
  createdAt: string;
}

// types/friend.ts
export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friend: User;
  createdAt: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  sender: User;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// types/notification.ts
export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'friend_request' | 'message';
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// types/sentiment.ts
export interface SentimentResult {
  label: 'positive' | 'neutral' | 'warning' | 'danger';
  categories: string[];
  confidence: number;
}
```

- [ ] User 타입 정의
- [ ] Post 타입 정의
- [ ] Comment 타입 정의
- [ ] ChatRoom, Message 타입 정의
- [ ] Friend, FriendRequest 타입 정의
- [ ] Notification 타입 정의
- [ ] SentimentResult 타입 정의

#### 6.2 Mock 데이터 파일 구조 (mocks/)

- [ ] users.ts - 사용자 목 데이터 (10명 이상)
- [ ] posts.ts - 게시글 목 데이터 (20개 이상)
- [ ] comments.ts - 댓글 목 데이터 (대댓글 포함)
- [ ] chat-rooms.ts - 채팅방 목 데이터
- [ ] messages.ts - 메시지 목 데이터
- [ ] friends.ts - 친구 목 데이터
- [ ] notifications.ts - 알림 목 데이터
- [ ] index.ts - 배럴 파일

---

### 7. Provider 설정

#### 7.1 Query Provider

```typescript
// providers/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

- [ ] QueryProvider 생성
- [ ] React Query Devtools 설치: `npm install -D @tanstack/react-query-devtools`

#### 7.2 Theme Provider

```typescript
// providers/theme-provider.tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] next-themes 설치: `npm install next-themes`
- [ ] ThemeProvider 생성

#### 7.3 Root Layout에 Provider 적용

```typescript
// app/layout.tsx
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] RootLayout에 Provider 적용

---

### 8. 유틸리티 함수 설정

#### 8.1 lib/utils.ts

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date();
  const target = new Date(date);
  const diff = now.getTime() - target.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  
  return formatDate(date);
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
```

- [ ] cn 함수 생성
- [ ] 날짜 포맷 함수 생성
- [ ] 상대 시간 함수 생성
- [ ] 문자열 자르기 함수 생성

---

## 📁 최종 폴더 구조 확인

Phase 0 완료 후 아래 구조가 생성되어야 합니다:

```
cc/src/
├── app/
│   ├── layout.tsx (수정됨)
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── ui/           (shadcn/ui 컴포넌트가 추가될 예정)
├── hooks/
├── lib/
│   └── utils.ts
├── store/
├── mocks/
├── types/
│   ├── user.ts
│   ├── post.ts
│   ├── comment.ts
│   ├── chat.ts
│   ├── friend.ts
│   ├── notification.ts
│   └── index.ts
├── providers/
│   ├── query-provider.tsx
│   └── theme-provider.tsx
└── styles/
```

---

## ✅ 완료 조건

- [ ] 모든 필수 패키지 설치 완료
- [ ] 폴더 구조 생성 완료
- [ ] 환경 변수 파일 생성 완료
- [ ] TypeScript 경로 별칭 동작 확인
- [ ] Provider 설정 및 적용 완료
- [ ] 프로젝트 빌드 성공 (`npm run build`)

---

**다음 단계**: [Phase 1: 디자인 시스템 구축](./01-design-system.md)
