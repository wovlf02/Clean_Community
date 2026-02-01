# 코딩 컨벤션

**관련 문서**: [개발 환경 설정](./setup.md) | [Git 컨벤션](../09_git/git-convention.md)

---

## 1. TypeScript/JavaScript

### 1.1 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 변수, 함수 | camelCase | `userName`, `getUserById` |
| 상수 | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `API_URL` |
| 컴포넌트 | PascalCase | `UserProfile`, `PostCard` |
| 타입, 인터페이스 | PascalCase | `User`, `PostCreateInput` |
| Enum | PascalCase | `UserRole`, `PostStatus` |
| 파일명 (컴포넌트) | PascalCase | `UserProfile.tsx` |
| 파일명 (유틸) | kebab-case | `date-utils.ts` |
| 폴더명 | kebab-case | `user-profile/` |

### 1.2 타입 정의

```typescript
// ✅ Good - interface 사용 (객체 타입)
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// ✅ Good - type 사용 (유니온, 교차 타입)
type PostStatus = 'draft' | 'published' | 'deleted';
type UserWithPosts = User & { posts: Post[] };

// ❌ Bad - any 사용
const data: any = fetchData();

// ✅ Good - 명시적 타입
const data: User = await fetchUser(id);
```

### 1.3 함수 작성

```typescript
// ✅ Good - 화살표 함수 (컴포넌트 외)
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR');
};

// ✅ Good - async/await
const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};

// ✅ Good - 에러 처리
const fetchUserSafe = async (id: string): Promise<User | null> => {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
};
```

---

## 2. React/Next.js

### 2.1 컴포넌트 구조

```typescript
// components/UserProfile.tsx

import { FC } from 'react';
import { cn } from '@/lib/utils';

// 1. 타입 정의
interface UserProfileProps {
  user: User;
  className?: string;
  onEdit?: () => void;
}

// 2. 컴포넌트 정의
export const UserProfile: FC<UserProfileProps> = ({
  user,
  className,
  onEdit,
}) => {
  // 3. 상태 (useState, useReducer)
  const [isEditing, setIsEditing] = useState(false);
  
  // 4. 커스텀 훅
  const { data, isLoading } = useUserPosts(user.id);
  
  // 5. 이벤트 핸들러
  const handleEdit = () => {
    setIsEditing(true);
    onEdit?.();
  };
  
  // 6. 조건부 렌더링
  if (isLoading) {
    return <Skeleton />;
  }
  
  // 7. 메인 렌더링
  return (
    <div className={cn('p-4', className)}>
      {/* ... */}
    </div>
  );
};
```

### 2.2 Server Components vs Client Components

```typescript
// ✅ Server Component (기본)
// app/users/page.tsx
export default async function UsersPage() {
  const users = await getUsers(); // 서버에서 직접 호출
  
  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// ✅ Client Component (상호작용 필요시)
// components/LikeButton.tsx
'use client';

import { useState } from 'react';

export const LikeButton = ({ postId }: { postId: string }) => {
  const [liked, setLiked] = useState(false);
  
  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '❤️' : '🤍'}
    </button>
  );
};
```

### 2.3 훅 사용 규칙

```typescript
// ✅ Good - 커스텀 훅으로 로직 분리
// hooks/useUser.ts
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
  });
};

// ✅ Good - 훅은 최상위에서만 호출
const Component = () => {
  const { data } = useUser(id); // ✅
  
  // ❌ Bad - 조건문 안에서 훅 호출
  if (condition) {
    const { data } = useUser(id); // ❌
  }
};
```

---

## 3. 스타일링 (Tailwind CSS)

### 3.1 클래스 정렬 순서

```tsx
// 1. 레이아웃 (display, position)
// 2. 박스 모델 (width, height, padding, margin)
// 3. 타이포그래피 (font, text)
// 4. 비주얼 (background, border, shadow)
// 5. 기타 (animation, cursor)
// 6. 반응형 (sm:, md:, lg:)
// 7. 상태 (hover:, focus:, dark:)

<div className="
  flex items-center justify-between
  w-full p-4 mb-2
  text-sm font-medium
  bg-white rounded-lg shadow-sm
  transition-colors
  md:p-6
  hover:bg-gray-50
  dark:bg-gray-800
"/>
```

### 3.2 cn 유틸리티 사용

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// 사용
<div className={cn(
  'p-4 rounded-lg',
  isActive && 'bg-blue-500',
  className
)} />
```

---

## 4. API Routes

### 4.1 구조

```typescript
// app/api/posts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// 스키마 정의
const createPostSchema = z.object({
  title: z.string().min(2).max(100),
  content: z.string().min(10),
  category: z.enum(['GENERAL', 'QNA', 'SHARE', 'DAILY']),
});

// GET 핸들러
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const posts = await prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST 핸들러
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // 요청 파싱 및 검증
    const body = await request.json();
    const validated = createPostSchema.parse(body);
    
    // 데이터 생성
    const post = await prisma.post.create({
      data: {
        ...validated,
        authorId: session.user.id,
      },
    });
    
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation Error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

---

## 5. 상태 관리

### 5.1 Zustand 스토어

```typescript
// store/useAuthStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### 5.2 React Query

```typescript
// hooks/usePosts.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 쿼리
export const usePosts = (page: number = 1) => {
  return useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetchPosts(page),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 뮤테이션
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
```

---

## 6. 에러 처리

```typescript
// lib/errors.ts

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Not Found') {
    super(message, 404, 'NOT_FOUND');
  }
}
```

---

## 7. 코드 포맷팅

### 7.1 ESLint 설정

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/display-name': 'off',
  },
};
```

### 7.2 Prettier 설정

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

**최종 업데이트**: 2026년 2월 2일
