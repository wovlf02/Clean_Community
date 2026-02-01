# 엔티티 스키마 (Prisma Schema)

**관련 문서**: [데이터베이스 스키마](./database-schema.md) | [기술 스택](../03_architecture/tech-stack.md)

---

## Prisma Schema 전체

```prisma
// schema.prisma

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// Enums
// ============================================

enum Role {
  USER
  ADMIN
}

enum PostCategory {
  GENERAL
  QNA
  SHARE
  DAILY
}

enum ChatRoomType {
  DM
  GROUP
}

enum ChatRole {
  OWNER
  MEMBER
}

enum MessageType {
  TEXT
  IMAGE
  EMOJI
}

enum FriendRequestStatus {
  PENDING
  ACCEPTED
  REJECTED
}

enum NotificationType {
  LIKE
  COMMENT
  FRIEND_REQUEST
  CHAT
}

enum ContentType {
  POST
  COMMENT
  MESSAGE
}

// ============================================
// NextAuth.js Models
// ============================================

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
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ============================================
// User Model
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  password      String?
  name          String
  nickname      String    @unique
  image         String?
  bio           String?   @db.Text
  role          Role      @default(USER)
  isOnline      Boolean   @default(false)
  lastSeenAt    DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  // Relations
  accounts       Account[]
  sessions       Session[]
  posts          Post[]
  comments       Comment[]
  likes          Like[]
  chatParticipants ChatParticipant[]
  messages       Message[]
  
  // Friend relations
  friends        Friend[]        @relation("UserFriends")
  friendOf       Friend[]        @relation("FriendOf")
  sentRequests   FriendRequest[] @relation("SentRequests")
  receivedRequests FriendRequest[] @relation("ReceivedRequests")
  
  notifications  Notification[]
  analysisLogs   AnalysisLog[]

  @@index([email])
  @@index([nickname])
  @@index([createdAt])
}

// ============================================
// Post Models
// ============================================

model Post {
  id           String       @id @default(cuid())
  authorId     String
  title        String       @db.VarChar(100)
  content      String       @db.Text
  category     PostCategory @default(GENERAL)
  viewCount    Int          @default(0)
  likeCount    Int          @default(0)
  commentCount Int          @default(0)
  isEdited     Boolean      @default(false)
  thumbnailUrl String?
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  deletedAt    DateTime?

  // Relations
  author      User         @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments    Comment[]
  likes       Like[]
  attachments Attachment[]

  @@index([authorId, createdAt(sort: Desc)])
  @@index([category, createdAt(sort: Desc)])
  @@index([createdAt(sort: Desc)])
}

model Comment {
  id        String    @id @default(cuid())
  postId    String
  authorId  String
  parentId  String?
  content   String    @db.VarChar(500)
  isEdited  Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  // Relations
  post     Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  author   User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  parent   Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies  Comment[] @relation("CommentReplies")

  @@index([postId, createdAt])
  @@index([authorId])
  @@index([parentId])
}

model Like {
  id        String   @id @default(cuid())
  userId    String
  postId    String
  createdAt DateTime @default(now())

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([userId, postId])
  @@index([postId])
}

model Attachment {
  id        String   @id @default(cuid())
  postId    String
  fileName  String
  fileUrl   String
  fileType  String
  fileSize  Int
  createdAt DateTime @default(now())

  // Relations
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@index([postId])
}

// ============================================
// Chat Models
// ============================================

model ChatRoom {
  id            String       @id @default(cuid())
  name          String?      @db.VarChar(50)
  type          ChatRoomType
  imageUrl      String?
  lastMessage   String?      @db.VarChar(200)
  lastMessageAt DateTime?
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  // Relations
  participants ChatParticipant[]
  messages     Message[]

  @@index([lastMessageAt(sort: Desc)])
}

model ChatParticipant {
  id          String    @id @default(cuid())
  chatRoomId  String
  userId      String
  role        ChatRole  @default(MEMBER)
  lastReadAt  DateTime?
  unreadCount Int       @default(0)
  joinedAt    DateTime  @default(now())
  leftAt      DateTime?

  // Relations
  chatRoom ChatRoom @relation(fields: [chatRoomId], references: [id], onDelete: Cascade)
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([chatRoomId, userId])
  @@index([userId])
}

model Message {
  id         String      @id @default(cuid())
  chatRoomId String
  senderId   String
  type       MessageType @default(TEXT)
  content    String      @db.Text
  imageUrl   String?
  createdAt  DateTime    @default(now())
  deletedAt  DateTime?

  // Relations
  chatRoom ChatRoom @relation(fields: [chatRoomId], references: [id], onDelete: Cascade)
  sender   User     @relation(fields: [senderId], references: [id], onDelete: Cascade)

  @@index([chatRoomId, createdAt(sort: Desc)])
  @@index([senderId])
}

// ============================================
// Friend Models
// ============================================

model Friend {
  id        String   @id @default(cuid())
  userId    String
  friendId  String
  createdAt DateTime @default(now())

  // Relations
  user   User @relation("UserFriends", fields: [userId], references: [id], onDelete: Cascade)
  friend User @relation("FriendOf", fields: [friendId], references: [id], onDelete: Cascade)

  @@unique([userId, friendId])
  @@index([userId])
  @@index([friendId])
}

model FriendRequest {
  id         String              @id @default(cuid())
  senderId   String
  receiverId String
  status     FriendRequestStatus @default(PENDING)
  createdAt  DateTime            @default(now())
  updatedAt  DateTime            @updatedAt

  // Relations
  sender   User @relation("SentRequests", fields: [senderId], references: [id], onDelete: Cascade)
  receiver User @relation("ReceivedRequests", fields: [receiverId], references: [id], onDelete: Cascade)

  @@unique([senderId, receiverId])
  @@index([receiverId, status])
}

// ============================================
// Notification Model
// ============================================

model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String           @db.VarChar(100)
  content   String           @db.VarChar(200)
  link      String?
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isRead, createdAt(sort: Desc)])
}

// ============================================
// AI Analysis Log Model
// ============================================

model AnalysisLog {
  id          String      @id @default(cuid())
  userId      String?
  contentType ContentType
  contentId   String
  text        String      @db.Text
  labels      Json
  scores      Json
  isFlagged   Boolean     @default(false)
  createdAt   DateTime    @default(now())

  // Relations
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([contentType, contentId])
  @@index([isFlagged, createdAt(sort: Desc)])
  @@index([userId])
}
```

---

## 마이그레이션 명령어

```bash
# 개발 환경 - 스키마 푸시 (빠른 프로토타이핑)
npx prisma db push

# 프로덕션 - 마이그레이션 생성
npx prisma migrate dev --name init

# 프로덕션 - 마이그레이션 적용
npx prisma migrate deploy

# Prisma Client 생성
npx prisma generate

# 데이터베이스 시드
npx prisma db seed

# Prisma Studio (GUI)
npx prisma studio
```

---

**최종 업데이트**: 2026년 2월 2일
