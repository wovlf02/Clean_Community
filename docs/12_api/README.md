# API 명세서

**관련 문서**: [시스템 설계](../03_architecture/system-design.md) | [데이터베이스 스키마](../04_database/database-schema.md)

---

## 📋 개요

감성 커뮤니티 백엔드 API 명세서입니다.

| 항목 | 값 |
|------|-----|
| **Base URL** | `https://api.emotion-community.com/api` |
| **버전** | v1 |
| **인증 방식** | JWT (NextAuth.js) |

---

## 🔐 인증

### 인증 방식

API 요청 시 `Authorization` 헤더에 JWT 토큰을 포함합니다.

```
Authorization: Bearer <access_token>
```

### 인증이 필요한 엔드포인트

| 표시 | 의미 |
|------|------|
| 🔓 | 인증 불필요 |
| 🔒 | 인증 필요 |
| 👑 | 관리자만 접근 가능 |

---

## 📊 응답 형식

### 성공 응답

```json
{
  "data": { ... },
  "message": "Success"
}
```

### 에러 응답

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지"
  }
}
```

### HTTP 상태 코드

| 코드 | 의미 |
|------|------|
| 200 | 성공 |
| 201 | 생성 성공 |
| 400 | 잘못된 요청 |
| 401 | 인증 필요 |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 429 | 요청 횟수 초과 |
| 500 | 서버 오류 |

---

## 🔑 인증 API

### POST /api/auth/signup 🔓

회원가입

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "password123!",
  "name": "홍길동",
  "nickname": "감성개발자"
}
```

**Response** `201`
```json
{
  "data": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "홍길동",
    "nickname": "감성개발자"
  },
  "message": "회원가입이 완료되었습니다."
}
```

### POST /api/auth/signin 🔓

로그인 (NextAuth.js Credentials)

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "password123!"
}
```

**Response** `200`
```json
{
  "data": {
    "user": {
      "id": "clx...",
      "email": "user@example.com",
      "name": "홍길동"
    }
  }
}
```

### POST /api/auth/signout 🔒

로그아웃

**Response** `200`
```json
{
  "message": "로그아웃되었습니다."
}
```

---

## 👤 사용자 API

### GET /api/users/me 🔒

내 정보 조회

**Response** `200`
```json
{
  "data": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "홍길동",
    "nickname": "감성개발자",
    "image": "https://...",
    "bio": "안녕하세요!",
    "role": "USER",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

### PUT /api/users/me 🔒

프로필 수정

**Request Body**
```json
{
  "nickname": "새닉네임",
  "bio": "새 자기소개"
}
```

**Response** `200`
```json
{
  "data": {
    "id": "clx...",
    "nickname": "새닉네임",
    "bio": "새 자기소개"
  },
  "message": "프로필이 수정되었습니다."
}
```

### PUT /api/users/me/password 🔒

비밀번호 변경

**Request Body**
```json
{
  "currentPassword": "oldPassword123!",
  "newPassword": "newPassword123!"
}
```

**Response** `200`
```json
{
  "message": "비밀번호가 변경되었습니다."
}
```

---

## 📝 게시판 API

### GET /api/posts 🔓

게시글 목록 조회

**Query Parameters**
| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| page | number | 1 | 페이지 번호 |
| limit | number | 10 | 페이지당 개수 |
| category | string | - | 카테고리 필터 |
| sort | string | latest | 정렬 (latest, popular, views) |
| search | string | - | 검색어 |

**Response** `200`
```json
{
  "data": {
    "posts": [
      {
        "id": "clx...",
        "title": "게시글 제목",
        "content": "게시글 내용...",
        "category": "GENERAL",
        "viewCount": 123,
        "likeCount": 45,
        "commentCount": 12,
        "thumbnailUrl": "https://...",
        "author": {
          "id": "clx...",
          "nickname": "작성자",
          "image": "https://..."
        },
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### POST /api/posts 🔒

게시글 작성

**Request Body**
```json
{
  "title": "게시글 제목",
  "content": "게시글 내용",
  "category": "GENERAL"
}
```

**Response** `201`
```json
{
  "data": {
    "id": "clx...",
    "title": "게시글 제목",
    "content": "게시글 내용",
    "category": "GENERAL"
  },
  "message": "게시글이 작성되었습니다."
}
```

### GET /api/posts/:id 🔓

게시글 상세 조회

**Response** `200`
```json
{
  "data": {
    "id": "clx...",
    "title": "게시글 제목",
    "content": "게시글 내용",
    "category": "GENERAL",
    "viewCount": 124,
    "likeCount": 45,
    "commentCount": 12,
    "isLiked": false,
    "author": {
      "id": "clx...",
      "nickname": "작성자",
      "image": "https://..."
    },
    "attachments": [
      {
        "id": "clx...",
        "fileName": "image.jpg",
        "fileUrl": "https://..."
      }
    ],
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

### PUT /api/posts/:id 🔒

게시글 수정 (작성자만)

**Request Body**
```json
{
  "title": "수정된 제목",
  "content": "수정된 내용"
}
```

**Response** `200`
```json
{
  "data": { ... },
  "message": "게시글이 수정되었습니다."
}
```

### DELETE /api/posts/:id 🔒

게시글 삭제 (작성자만)

**Response** `200`
```json
{
  "message": "게시글이 삭제되었습니다."
}
```

### POST /api/posts/:id/like 🔒

좋아요 토글

**Response** `200`
```json
{
  "data": {
    "liked": true,
    "likeCount": 46
  }
}
```

---

## 💬 댓글 API

### GET /api/posts/:postId/comments 🔓

댓글 목록 조회

**Response** `200`
```json
{
  "data": {
    "comments": [
      {
        "id": "clx...",
        "content": "댓글 내용",
        "author": {
          "id": "clx...",
          "nickname": "작성자",
          "image": "https://..."
        },
        "replies": [
          {
            "id": "clx...",
            "content": "대댓글 내용",
            "author": { ... },
            "createdAt": "2025-01-01T00:00:00Z"
          }
        ],
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

### POST /api/posts/:postId/comments 🔒

댓글 작성

**Request Body**
```json
{
  "content": "댓글 내용",
  "parentId": "clx..."  // 대댓글인 경우
}
```

**Response** `201`
```json
{
  "data": {
    "id": "clx...",
    "content": "댓글 내용"
  },
  "message": "댓글이 작성되었습니다."
}
```

### DELETE /api/comments/:id 🔒

댓글 삭제 (작성자만)

**Response** `200`
```json
{
  "message": "댓글이 삭제되었습니다."
}
```

---

## 💬 채팅 API

### GET /api/chat/rooms 🔒

채팅방 목록 조회

**Response** `200`
```json
{
  "data": {
    "rooms": [
      {
        "id": "clx...",
        "name": null,
        "type": "DM",
        "lastMessage": "안녕하세요",
        "lastMessageAt": "2025-01-01T00:00:00Z",
        "unreadCount": 3,
        "participants": [
          {
            "id": "clx...",
            "nickname": "상대방",
            "image": "https://...",
            "isOnline": true
          }
        ]
      }
    ]
  }
}
```

### POST /api/chat/rooms 🔒

채팅방 생성

**Request Body**
```json
{
  "type": "DM",           // DM 또는 GROUP
  "participantIds": ["clx..."],
  "name": "그룹 이름"     // GROUP인 경우
}
```

**Response** `201`
```json
{
  "data": {
    "id": "clx...",
    "type": "DM"
  },
  "message": "채팅방이 생성되었습니다."
}
```

### GET /api/chat/rooms/:id/messages 🔒

메시지 목록 조회

**Query Parameters**
| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| cursor | string | - | 페이지네이션 커서 |
| limit | number | 50 | 조회 개수 |

**Response** `200`
```json
{
  "data": {
    "messages": [
      {
        "id": "clx...",
        "type": "TEXT",
        "content": "메시지 내용",
        "sender": {
          "id": "clx...",
          "nickname": "발신자",
          "image": "https://..."
        },
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "nextCursor": "clx..."
  }
}
```

---

## 👥 친구 API

### GET /api/friends 🔒

친구 목록 조회

**Response** `200`
```json
{
  "data": {
    "friends": [
      {
        "id": "clx...",
        "nickname": "친구닉네임",
        "image": "https://...",
        "bio": "자기소개",
        "isOnline": true,
        "lastSeenAt": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

### POST /api/friends/request 🔒

친구 요청

**Request Body**
```json
{
  "userId": "clx..."
}
```

**Response** `201`
```json
{
  "message": "친구 요청을 보냈습니다."
}
```

### GET /api/friends/requests 🔒

친구 요청 목록

**Response** `200`
```json
{
  "data": {
    "received": [
      {
        "id": "clx...",
        "sender": {
          "id": "clx...",
          "nickname": "요청자",
          "image": "https://..."
        },
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "sent": [...]
  }
}
```

### POST /api/friends/requests/:id/accept 🔒

친구 요청 수락

**Response** `200`
```json
{
  "message": "친구 요청을 수락했습니다."
}
```

### POST /api/friends/requests/:id/reject 🔒

친구 요청 거절

**Response** `200`
```json
{
  "message": "친구 요청을 거절했습니다."
}
```

### DELETE /api/friends/:id 🔒

친구 삭제

**Response** `200`
```json
{
  "message": "친구를 삭제했습니다."
}
```

---

## 🤖 AI 감정분석 API

### POST /api/analyze 🔒

텍스트 감정분석

**Request Body**
```json
{
  "text": "분석할 텍스트"
}
```

**Response** `200`
```json
{
  "data": {
    "labels": ["혐오", "차별"],
    "scores": [0.85, 0.72],
    "isFlagged": true
  }
}
```

---

## 🔔 알림 API

### GET /api/notifications 🔒

알림 목록 조회

**Response** `200`
```json
{
  "data": {
    "notifications": [
      {
        "id": "clx...",
        "type": "LIKE",
        "title": "좋아요",
        "content": "닉네임님이 좋아요를 눌렀습니다.",
        "link": "/board/clx...",
        "isRead": false,
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

### PUT /api/notifications/:id/read 🔒

알림 읽음 처리

**Response** `200`
```json
{
  "message": "알림을 읽음 처리했습니다."
}
```

### PUT /api/notifications/read-all 🔒

전체 알림 읽음 처리

**Response** `200`
```json
{
  "message": "모든 알림을 읽음 처리했습니다."
}
```

---

## 📁 파일 업로드 API

### POST /api/upload/presigned 🔒

Presigned URL 발급

**Request Body**
```json
{
  "fileName": "image.jpg",
  "fileType": "image/jpeg"
}
```

**Response** `200`
```json
{
  "data": {
    "uploadUrl": "https://s3...",
    "fileUrl": "https://cdn..."
  }
}
```

---

**최종 업데이트**: 2026년 1월 29일
