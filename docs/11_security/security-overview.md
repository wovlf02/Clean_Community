# 보안 설계 개요

**관련 문서**: [시스템 설계](../03_architecture/system-design.md) | [AWS 설정](../10_aws/README.md)

---

## 1. 보안 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Security Layers                                    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                        Network Security                                 │ │
│  │  • HTTPS/WSS 강제          • VPC 격리                                  │ │
│  │  • WAF (선택)               • 보안 그룹                                │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                    ▼                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                       Application Security                              │ │
│  │  • 인증 (NextAuth.js)       • Rate Limiting                           │ │
│  │  • 인가 (Role-based)        • Input Validation                        │ │
│  │  • CORS                      • XSS Prevention                          │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                    ▼                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                        Data Security                                    │ │
│  │  • 암호화 (AES-256)         • 비밀번호 해싱 (BCrypt)                   │ │
│  │  • 민감정보 마스킹          • 백업 암호화                              │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 인증 (Authentication)

### 2.1 NextAuth.js 설정

```typescript
// lib/auth.ts

import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcrypt';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('이메일과 비밀번호를 입력해주세요.');
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user || !user.password) {
          throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
        }
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValid) {
          throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
```

### 2.2 비밀번호 정책

| 항목 | 요구사항 |
|------|----------|
| 최소 길이 | 8자 |
| 필수 포함 | 영문, 숫자, 특수문자 |
| 해싱 | BCrypt (salt rounds: 12) |
| 만료 | 없음 (권장: 90일) |

```typescript
// lib/password.ts

import bcrypt from 'bcrypt';
import { z } from 'zod';

const SALT_ROUNDS = 12;

export const passwordSchema = z.string()
  .min(8, '비밀번호는 8자 이상이어야 합니다.')
  .regex(/[a-zA-Z]/, '영문자를 포함해야 합니다.')
  .regex(/[0-9]/, '숫자를 포함해야 합니다.')
  .regex(/[!@#$%^&*]/, '특수문자를 포함해야 합니다.');

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (
  password: string, 
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

---

## 3. 인가 (Authorization)

### 3.1 역할 기반 접근 제어

```typescript
// middleware.ts

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    
    // 관리자 전용 경로
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/chat/:path*',
    '/friends/:path*',
    '/settings/:path*',
    '/admin/:path*',
  ],
};
```

### 3.2 API 권한 검사

```typescript
// lib/auth-guard.ts

import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { NextResponse } from 'next/server';

export const requireAuth = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return session;
};

export const requireAdmin = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }
  
  return session;
};
```

---

## 4. 입력 검증

### 4.1 Zod 스키마

```typescript
// lib/validations.ts

import { z } from 'zod';

// 이메일 검증
export const emailSchema = z.string()
  .email('유효한 이메일 주소를 입력해주세요.');

// 게시글 생성
export const createPostSchema = z.object({
  title: z.string()
    .min(2, '제목은 2자 이상이어야 합니다.')
    .max(100, '제목은 100자 이하여야 합니다.')
    .trim(),
  content: z.string()
    .min(10, '내용은 10자 이상이어야 합니다.')
    .max(10000, '내용은 10000자 이하여야 합니다.'),
  category: z.enum(['GENERAL', 'QNA', 'SHARE', 'DAILY']),
});

// 댓글 생성
export const createCommentSchema = z.object({
  content: z.string()
    .min(1, '댓글을 입력해주세요.')
    .max(500, '댓글은 500자 이하여야 합니다.')
    .trim(),
  parentId: z.string().optional(),
});

// 파일 업로드
export const uploadSchema = z.object({
  fileName: z.string(),
  fileType: z.enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']),
  fileSize: z.number().max(10 * 1024 * 1024, '파일 크기는 10MB 이하여야 합니다.'),
});
```

### 4.2 XSS 방지

```typescript
// lib/sanitize.ts

import DOMPurify from 'isomorphic-dompurify';

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target'],
  });
};

export const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
```

---

## 5. Rate Limiting

### 5.1 API Rate Limiting

```typescript
// lib/rate-limit.ts

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

// API 요청 제한 (분당 100회)
export const apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
});

// 로그인 시도 제한 (5회 실패 시 15분 잠금)
export const loginRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
});

// AI 분석 제한 (분당 30회)
export const aiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 m'),
});
```

### 5.2 미들웨어 적용

```typescript
// app/api/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { apiRateLimiter } from '@/lib/rate-limit';

export async function rateLimitMiddleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  
  const { success, limit, remaining, reset } = await apiRateLimiter.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    );
  }
  
  return null;
}
```

---

## 6. CORS 설정

```typescript
// next.config.js

module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGIN },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
    ];
  },
};
```

---

## 7. 보안 헤더

```typescript
// next.config.js

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.example.com wss://socket.example.com;",
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## 8. 파일 업로드 보안

```typescript
// lib/upload.ts

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // MIME 타입 검사
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: '허용되지 않는 파일 형식입니다.' };
  }
  
  // 파일 크기 검사
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: '파일 크기는 10MB 이하여야 합니다.' };
  }
  
  // 파일 확장자 검사
  const extension = file.name.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];
  
  if (!extension || !allowedExtensions.includes(extension)) {
    return { valid: false, error: '허용되지 않는 파일 확장자입니다.' };
  }
  
  return { valid: true };
};
```

---

## 9. 보안 체크리스트

### 9.1 인증/인가

- [ ] 모든 비밀번호 BCrypt 해싱
- [ ] JWT 토큰 서명 및 검증
- [ ] 세션 만료 설정
- [ ] 역할 기반 접근 제어

### 9.2 데이터 보호

- [ ] HTTPS 강제
- [ ] 민감 데이터 암호화
- [ ] SQL Injection 방지 (Prisma ORM)
- [ ] XSS 방지

### 9.3 API 보안

- [ ] Rate Limiting 적용
- [ ] CORS 설정
- [ ] 입력 값 검증
- [ ] 에러 메시지 최소화

### 9.4 인프라

- [ ] VPC 격리
- [ ] 보안 그룹 최소 권한
- [ ] 비밀 관리 (Secrets Manager)
- [ ] 로그 모니터링

---

**최종 업데이트**: 2026년 1월 29일
