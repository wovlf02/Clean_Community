# Phase 10: 백엔드 API 구축

**관련 문서**: [데이터베이스 스키마](../../04_database/database-schema.md) | [시스템 설계](../../03_architecture/system-design.md)

---

## 📋 개요

Next.js API Routes와 Prisma ORM을 사용하여 백엔드 API를 구축하고, Mock 데이터를 실제 데이터베이스로 교체합니다.

**예상 소요 시간**: 5일

---

## ✅ 체크리스트

### 1. Prisma 설정

#### 1.1 Prisma 설치

```bash
npm install prisma @prisma/client
npm install -D prisma
npx prisma init
```

- [ ] Prisma 설치
- [ ] prisma/schema.prisma 생성 확인

#### 1.2 스키마 정의

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 사용자
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  password      String?
  name          String
  nickname      String    @unique
  image         String?
  bio           String?
  role          Role      @default(USER)
  isOnline      Boolean   @default(false)
  lastSeenAt    DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  accounts      Account[]
  sessions      Session[]
  posts         Post[]
  comments      Comment[]
  likes         Like[]
  sentMessages  Message[] @relation("SentMessages")
  notifications Notification[]
  
  // 친구 관계
  sentFriendRequests     FriendRequest[] @relation("SentRequests")
  receivedFriendRequests FriendRequest[] @relation("ReceivedRequests")
  friendsOf              Friend[]        @relation("FriendsOf")
  friends                Friend[]        @relation("Friends")
  
  // 채팅
  chatParticipants ChatParticipant[]
}

enum Role {
  USER
  ADMIN
}

// OAuth 계정
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

// 세션
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// 게시글
model Post {
  id           String       @id @default(cuid())
  authorId     String
  title        String
  content      String       @db.Text
  category     PostCategory
  viewCount    Int          @default(0)
  likeCount    Int          @default(0)
  commentCount Int          @default(0)
  isEdited     Boolean      @default(false)
  thumbnailUrl String?
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  deletedAt    DateTime?

  author      User         @relation(fields: [authorId], references: [id])
  comments    Comment[]
  likes       Like[]
  attachments Attachment[]
}

enum PostCategory {
  GENERAL
  QNA
  INFO
  DAILY
}

// 댓글
model Comment {
  id        String    @id @default(cuid())
  postId    String
  authorId  String
  parentId  String?
  content   String    @db.Text
  isEdited  Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  post    Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  author  User      @relation(fields: [authorId], references: [id])
  parent  Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies Comment[] @relation("CommentReplies")
}

// 좋아요
model Like {
  id        String   @id @default(cuid())
  userId    String
  postId    String
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([userId, postId])
}

// 첨부파일
model Attachment {
  id        String   @id @default(cuid())
  postId    String
  fileName  String
  fileUrl   String
  fileType  String
  fileSize  Int
  createdAt DateTime @default(now())

  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
}

// 채팅방
model ChatRoom {
  id        String   @id @default(cuid())
  type      ChatType @default(DIRECT)
  name      String?
  createdAt DateTime @default(now())

  participants ChatParticipant[]
  messages     Message[]
}

enum ChatType {
  DIRECT
  GROUP
}

// 채팅 참여자
model ChatParticipant {
  id        String   @id @default(cuid())
  roomId    String
  userId    String
  joinedAt  DateTime @default(now())
  leftAt    DateTime?

  room ChatRoom @relation(fields: [roomId], references: [id], onDelete: Cascade)
  user User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([roomId, userId])
}

// 메시지
model Message {
  id        String      @id @default(cuid())
  roomId    String
  senderId  String
  content   String      @db.Text
  type      MessageType @default(TEXT)
  isRead    Boolean     @default(false)
  createdAt DateTime    @default(now())

  room   ChatRoom @relation(fields: [roomId], references: [id], onDelete: Cascade)
  sender User     @relation("SentMessages", fields: [senderId], references: [id])
}

enum MessageType {
  TEXT
  IMAGE
  EMOJI
}

// 친구 관계
model Friend {
  id        String   @id @default(cuid())
  userId    String
  friendId  String
  createdAt DateTime @default(now())

  user   User @relation("Friends", fields: [userId], references: [id], onDelete: Cascade)
  friend User @relation("FriendsOf", fields: [friendId], references: [id], onDelete: Cascade)

  @@unique([userId, friendId])
}

// 친구 요청
model FriendRequest {
  id         String              @id @default(cuid())
  senderId   String
  receiverId String
  status     FriendRequestStatus @default(PENDING)
  createdAt  DateTime            @default(now())
  updatedAt  DateTime            @updatedAt

  sender   User @relation("SentRequests", fields: [senderId], references: [id], onDelete: Cascade)
  receiver User @relation("ReceivedRequests", fields: [receiverId], references: [id], onDelete: Cascade)

  @@unique([senderId, receiverId])
}

enum FriendRequestStatus {
  PENDING
  ACCEPTED
  REJECTED
}

// 알림
model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  message   String
  isRead    Boolean          @default(false)
  link      String?
  createdAt DateTime         @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum NotificationType {
  LIKE
  COMMENT
  FRIEND_REQUEST
  MESSAGE
}
```

- [ ] Prisma 스키마 작성
- [ ] 마이그레이션 실행: `npx prisma migrate dev`
- [ ] Prisma Client 생성: `npx prisma generate`

#### 1.3 Prisma Client 싱글톤

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

- [ ] Prisma Client 싱글톤 설정

---

### 2. NextAuth.js 설정

#### 2.1 NextAuth 설치

```bash
npm install next-auth@beta @auth/prisma-adapter
npm install bcryptjs
npm install -D @types/bcryptjs
```

- [ ] NextAuth 설치
- [ ] bcryptjs 설치

#### 2.2 Auth 설정

```typescript
// auth.ts (루트)
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Kakao from 'next-auth/providers/kakao';
import Naver from 'next-auth/providers/naver';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return user;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
    Naver({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        nickname: user.nickname,
        role: user.role,
      },
    }),
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});
```

- [ ] NextAuth 설정
- [ ] Credentials Provider (이메일/비밀번호)
- [ ] OAuth Providers (Google, Kakao, Naver)
- [ ] 세션 콜백 설정

#### 2.3 API Route 설정

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth';

export const { GET, POST } = handlers;
```

- [ ] NextAuth API Route 설정

---

### 3. 인증 API

- [ ] POST /api/auth/register - 회원가입
- [ ] POST /api/auth/verify-email - 이메일 인증
- [ ] POST /api/auth/forgot-password - 비밀번호 재설정 요청
- [ ] POST /api/auth/reset-password - 비밀번호 재설정

---

### 4. 사용자 API

- [ ] GET /api/users/me - 현재 사용자 조회
- [ ] PATCH /api/users/me - 프로필 수정
- [ ] PATCH /api/users/me/password - 비밀번호 변경
- [ ] DELETE /api/users/me - 계정 탈퇴 (Soft Delete)

---

### 5. 게시판 API

- [ ] GET /api/posts - 게시글 목록 (페이지네이션, 필터, 검색)
- [ ] POST /api/posts - 게시글 작성
- [ ] GET /api/posts/[id] - 게시글 상세
- [ ] PATCH /api/posts/[id] - 게시글 수정
- [ ] DELETE /api/posts/[id] - 게시글 삭제
- [ ] POST /api/posts/[id]/like - 좋아요 토글
- [ ] POST /api/posts/[id]/view - 조회수 증가

---

### 6. 댓글 API

- [ ] GET /api/posts/[id]/comments - 댓글 목록
- [ ] POST /api/posts/[id]/comments - 댓글 작성
- [ ] PATCH /api/comments/[id] - 댓글 수정
- [ ] DELETE /api/comments/[id] - 댓글 삭제

---

### 7. 채팅 API

- [ ] GET /api/chat/rooms - 채팅방 목록
- [ ] POST /api/chat/rooms - 채팅방 생성
- [ ] GET /api/chat/rooms/[id] - 채팅방 상세
- [ ] GET /api/chat/rooms/[id]/messages - 메시지 목록
- [ ] POST /api/chat/rooms/[id]/messages - 메시지 저장

---

### 8. 친구 API

- [ ] GET /api/friends - 친구 목록
- [ ] GET /api/friends/requests - 친구 요청 목록
- [ ] POST /api/friends/requests - 친구 요청 보내기
- [ ] PATCH /api/friends/requests/[id] - 요청 수락/거절
- [ ] DELETE /api/friends/[id] - 친구 삭제

---

### 9. 대시보드 API

- [ ] GET /api/dashboard/stats - 사용자 통계
- [ ] GET /api/dashboard/activity - 주간 활동
- [ ] GET /api/posts/popular - 인기 게시글

---

### 10. 알림 API

- [ ] GET /api/notifications - 알림 목록
- [ ] PATCH /api/notifications/read - 읽음 처리
- [ ] DELETE /api/notifications/[id] - 알림 삭제

---

### 11. Mock 데이터 → API 연동

- [ ] Auth Store → NextAuth 연동
- [ ] 게시판 → React Query + API
- [ ] 채팅 → React Query + API
- [ ] 친구 → React Query + API
- [ ] 대시보드 → React Query + API
- [ ] Mock 데이터 파일 삭제

---

## 📁 생성되는 파일 목록

```
cc/
├── prisma/
│   └── schema.prisma
├── auth.ts
├── lib/
│   └── prisma.ts
└── app/api/
    ├── auth/
    │   ├── [...nextauth]/route.ts
    │   ├── register/route.ts
    │   └── ...
    ├── users/
    │   └── me/route.ts
    ├── posts/
    │   ├── route.ts
    │   └── [id]/
    │       ├── route.ts
    │       ├── like/route.ts
    │       └── comments/route.ts
    ├── comments/
    │   └── [id]/route.ts
    ├── chat/
    │   └── rooms/...
    ├── friends/
    │   └── ...
    ├── dashboard/
    │   └── ...
    └── notifications/
        └── ...
```

---

## ✅ 완료 조건

- [ ] Prisma 스키마 작성 및 마이그레이션 완료
- [ ] NextAuth.js 설정 완료
- [ ] 모든 API 엔드포인트 구현
- [ ] Mock 데이터 → 실제 API 연동 완료
- [ ] Mock 데이터 파일 삭제
- [ ] 프로젝트 빌드 성공 (`npm run build`)

---

**이전 단계**: [Phase 9: 설정 화면 개발](./09-settings-pages.md)

**다음 단계**: [Phase 11: AI 서버 연동](./11-ai-integration.md)
