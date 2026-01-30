# 데이터베이스 스키마

**관련 문서**: [엔티티 스키마](./entity-schema.md) | [시스템 설계](../03_architecture/system-design.md)

---

## 1. 개요

감성 커뮤니티 애플리케이션의 데이터베이스 설계 문서입니다.

### 1.1 기술 스택

| 구성요소 | 개발 환경 | 운영 환경 |
|----------|----------|----------|
| **Database** | PostgreSQL 15+ | PostgreSQL 15+ (RDS) |
| **ORM** | Prisma 5.x | Prisma 5.x |
| **Cache** | - | Redis (ElastiCache) |

### 1.2 연동 구조

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Next.js      │────▶│   API Routes    │────▶│    Database     │
│   (Frontend)    │     │   + Prisma ORM  │     │   PostgreSQL    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │                        │
                               │                        │
                               ▼                        ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │   Express.js    │────▶│     Redis       │
                        │  Socket Server  │     │  (ElastiCache)  │
                        └─────────────────┘     └─────────────────┘
```

### 1.3 설계 원칙

1. **정규화**: 제3정규형(3NF) 준수
2. **비정규화**: 조회 성능 최적화를 위한 선별적 비정규화
3. **Soft Delete**: 중요 데이터는 물리 삭제 대신 `deletedAt` 플래그 사용
4. **UUID PK**: 분산 환경을 위한 UUID 사용 (cuid)
5. **타임스탬프**: 모든 테이블에 `createdAt`, `updatedAt` 포함

---

## 2. ERD 개요

### 2.1 테이블 분류

| 분류 | 테이블 | 설명 |
|------|--------|------|
| **사용자** | User, Account, Session | 사용자 및 인증 |
| **게시판** | Post, Comment, Like, Attachment | 게시판 관련 |
| **채팅** | ChatRoom, ChatParticipant, Message | 채팅 관련 |
| **친구** | Friend, FriendRequest | 친구 관계 |
| **알림** | Notification | 알림 |
| **AI** | AnalysisLog | 감정분석 로그 |

**총 12개 테이블**

### 2.2 관계 구조

```
User (사용자)
  │
  ├── 1:N ──▶ Account (OAuth 계정)
  ├── 1:N ──▶ Session (세션)
  │
  ├── 1:N ──▶ Post (게시글)
  │             ├── 1:N ──▶ Comment (댓글)
  │             ├── 1:N ──▶ Like (좋아요)
  │             └── 1:N ──▶ Attachment (첨부파일)
  │
  ├── 1:N ──▶ Comment (댓글)
  │             └── N:1 ──▶ Comment (부모 댓글, self-ref)
  │
  ├── 1:N ──▶ Like (좋아요)
  │
  ├── N:M ──▶ ChatRoom (채팅방) via ChatParticipant
  │             └── 1:N ──▶ Message (메시지)
  │
  ├── N:M ──▶ User (친구) via Friend
  │
  ├── 1:N ──▶ FriendRequest (친구 요청 - 발신)
  ├── 1:N ──▶ FriendRequest (친구 요청 - 수신)
  │
  ├── 1:N ──▶ Notification (알림)
  │
  └── 1:N ──▶ AnalysisLog (감정분석 로그)
```

---

## 3. 테이블 상세 정의

### 3.1 User (사용자)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | String | PK, cuid | 고유 식별자 |
| email | String | UNIQUE | 이메일 (로그인 ID) |
| emailVerified | DateTime? | - | 이메일 인증 일시 |
| password | String? | - | 비밀번호 해시 (소셜 로그인 시 null) |
| name | String | - | 실명 |
| nickname | String | UNIQUE | 닉네임 |
| image | String? | - | 프로필 이미지 URL |
| bio | String? | - | 자기소개 |
| role | Enum | DEFAULT 'USER' | 권한 (USER, ADMIN) |
| isOnline | Boolean | DEFAULT false | 온라인 상태 |
| lastSeenAt | DateTime? | - | 마지막 접속 시간 |
| createdAt | DateTime | DEFAULT now() | 생성일시 |
| updatedAt | DateTime | @updatedAt | 수정일시 |
| deletedAt | DateTime? | - | 삭제일시 (Soft Delete) |

### 3.2 Account (OAuth 계정)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | String | PK, cuid | 고유 식별자 |
| userId | String | FK → User | 사용자 ID |
| type | String | - | 계정 타입 |
| provider | String | - | OAuth 제공자 (google, kakao, naver) |
| providerAccountId | String | - | 제공자 계정 ID |
| refresh_token | String? | - | 리프레시 토큰 |
| access_token | String? | - | 액세스 토큰 |
| expires_at | Int? | - | 만료 시간 |
| token_type | String? | - | 토큰 타입 |
| scope | String? | - | 스코프 |
| id_token | String? | - | ID 토큰 |

**UNIQUE**: (provider, providerAccountId)

### 3.3 Session (세션)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | String | PK, cuid | 고유 식별자 |
| sessionToken | String | UNIQUE | 세션 토큰 |
| userId | String | FK → User | 사용자 ID |
| expires | DateTime | - | 만료 일시 |

### 3.4 Post (게시글)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | String | PK, cuid | 고유 식별자 |
| authorId | String | FK → User | 작성자 ID |
| title | String | - | 제목 (2-100자) |
| content | String | - | 본문 (마크다운) |
| category | Enum | - | 카테고리 |
| viewCount | Int | DEFAULT 0 | 조회수 |
| likeCount | Int | DEFAULT 0 | 좋아요 수 (비정규화) |
| commentCount | Int | DEFAULT 0 | 댓글 수 (비정규화) |
| isEdited | Boolean | DEFAULT false | 수정 여부 |
| thumbnailUrl | String? | - | 썸네일 URL |
| createdAt | DateTime | DEFAULT now() | 생성일시 |
| updatedAt | DateTime | @updatedAt | 수정일시 |
| deletedAt | DateTime? | - | 삭제일시 |

### 3.5 Comment (댓글)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | String | PK, cuid | 고유 식별자 |
| postId | String | FK → Post | 게시글 ID |
| authorId | String | FK → User | 작성자 ID |
| parentId | String? | FK → Comment | 부모 댓글 ID (대댓글) |
| content | String | - | 댓글 내용 (500자) |
| isEdited | Boolean | DEFAULT false | 수정 여부 |
| createdAt | DateTime | DEFAULT now() | 생성일시 |
| updatedAt | DateTime | @updatedAt | 수정일시 |
| deletedAt | DateTime? | - | 삭제일시 |

### 3.6 Like (좋아요)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | String | PK, cuid | 고유 식별자 |
| userId | String | FK → User | 사용자 ID |
| postId | String | FK → Post | 게시글 ID |
| createdAt | DateTime | DEFAULT now() | 생성일시 |

**UNIQUE**: (userId, postId)

### 3.7 Attachment (첨부파일)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | String | PK, cuid | 고유 식별자 |
| postId | String | FK → Post | 게시글 ID |
| fileName | String | - | 원본 파일명 |
| fileUrl | String | - | 저장 URL (S3) |
| fileType | String | - | MIME 타입 |
| fileSize | Int | - | 파일 크기 (bytes) |
| createdAt | DateTime | DEFAULT now() | 생성일시 |

### 3.8 ChatRoom (채팅방)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | String | PK, cuid | 고유 식별자 |
| name | String? | - | 채팅방 이름 (그룹만) |
| type | Enum | - | 타입 (DM, GROUP) |
| imageUrl | String? | - | 채팅방 이미지 |
| lastMessage | String? | - | 마지막 메시지 (비정규화) |
| lastMessageAt | DateTime? | - | 마지막 메시지 시간 |
| createdAt | DateTime | DEFAULT now() | 생성일시 |
| updatedAt | DateTime | @updatedAt | 수정일시 |

### 3.9 ChatParticipant (채팅 참여자)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | String | PK, cuid | 고유 식별자 |
| chatRoomId | String | FK → ChatRoom | 채팅방 ID |
| userId | String | FK → User | 사용자 ID |
| role | Enum | DEFAULT 'MEMBER' | 역할 (OWNER, MEMBER) |
| lastReadAt | DateTime? | - | 마지막 읽은 시간 |
| unreadCount | Int | DEFAULT 0 | 읽지 않은 메시지 수 |
| joinedAt | DateTime | DEFAULT now() | 참여 일시 |
| leftAt | DateTime? | - | 나간 일시 |

**UNIQUE**: (chatRoomId, userId)

### 3.10 Message (메시지)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | String | PK, cuid | 고유 식별자 |
| chatRoomId | String | FK → ChatRoom | 채팅방 ID |
| senderId | String | FK → User | 발신자 ID |
| type | Enum | DEFAULT 'TEXT' | 타입 (TEXT, IMAGE, EMOJI) |
| content | String | - | 메시지 내용 |
| imageUrl | String? | - | 이미지 URL (이미지 메시지) |
| createdAt | DateTime | DEFAULT now() | 생성일시 |
| deletedAt | DateTime? | - | 삭제일시 |

### 3.11 Friend (친구 관계)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | String | PK, cuid | 고유 식별자 |
| userId | String | FK → User | 사용자 ID |
| friendId | String | FK → User | 친구 ID |
| createdAt | DateTime | DEFAULT now() | 생성일시 |

**UNIQUE**: (userId, friendId)

### 3.12 FriendRequest (친구 요청)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | String | PK, cuid | 고유 식별자 |
| senderId | String | FK → User | 발신자 ID |
| receiverId | String | FK → User | 수신자 ID |
| status | Enum | DEFAULT 'PENDING' | 상태 (PENDING, ACCEPTED, REJECTED) |
| createdAt | DateTime | DEFAULT now() | 생성일시 |
| updatedAt | DateTime | @updatedAt | 처리일시 |

**UNIQUE**: (senderId, receiverId)

### 3.13 Notification (알림)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | String | PK, cuid | 고유 식별자 |
| userId | String | FK → User | 수신자 ID |
| type | Enum | - | 타입 (LIKE, COMMENT, FRIEND_REQUEST, CHAT) |
| title | String | - | 제목 |
| content | String | - | 내용 |
| link | String? | - | 이동 링크 |
| isRead | Boolean | DEFAULT false | 읽음 여부 |
| createdAt | DateTime | DEFAULT now() | 생성일시 |

### 3.14 AnalysisLog (감정분석 로그)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | String | PK, cuid | 고유 식별자 |
| userId | String? | FK → User | 작성자 ID |
| contentType | Enum | - | 콘텐츠 타입 (POST, COMMENT, MESSAGE) |
| contentId | String | - | 콘텐츠 ID |
| text | String | - | 분석 대상 텍스트 |
| labels | Json | - | 분석 결과 라벨 |
| scores | Json | - | 분석 결과 점수 |
| isFlagged | Boolean | DEFAULT false | 유해 콘텐츠 여부 |
| createdAt | DateTime | DEFAULT now() | 분석일시 |

---

## 4. 인덱스 전략

### 4.1 핵심 인덱스

| 테이블 | 인덱스 | 용도 |
|--------|--------|------|
| User | `idx_user_email` | 로그인 조회 |
| User | `idx_user_nickname` | 닉네임 검색 |
| Post | `idx_post_author_created` | 사용자별 게시글 목록 |
| Post | `idx_post_category_created` | 카테고리별 목록 |
| Comment | `idx_comment_post_created` | 게시글 댓글 목록 |
| Message | `idx_message_room_created` | 채팅 메시지 목록 |
| Notification | `idx_notification_user_read` | 읽지 않은 알림 |
| Friend | `idx_friend_user` | 친구 목록 |

---

## 5. Enum 정의

```prisma
enum Role {
  USER
  ADMIN
}

enum PostCategory {
  GENERAL    // 일반
  QNA        // Q&A
  SHARE      // 정보공유
  DAILY      // 일상
}

enum ChatRoomType {
  DM         // 1:1 채팅
  GROUP      // 그룹 채팅
}

enum ChatRole {
  OWNER      // 방장
  MEMBER     // 멤버
}

enum MessageType {
  TEXT       // 텍스트
  IMAGE      // 이미지
  EMOJI      // 이모티콘
}

enum FriendRequestStatus {
  PENDING    // 대기
  ACCEPTED   // 수락
  REJECTED   // 거절
}

enum NotificationType {
  LIKE            // 좋아요
  COMMENT         // 댓글
  FRIEND_REQUEST  // 친구 요청
  CHAT            // 채팅
}

enum ContentType {
  POST       // 게시글
  COMMENT    // 댓글
  MESSAGE    // 채팅 메시지
}
```

---

**최종 업데이트**: 2026년 1월 29일
