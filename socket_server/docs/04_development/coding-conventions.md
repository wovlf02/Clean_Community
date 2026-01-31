# 코딩 컨벤션

**관련 문서**: [개발 환경 설정](./setup.md) | [테스트 가이드](./testing.md)

---

## TypeScript

### 일반 규칙

- **엄격 모드**: `strict: true` 사용
- **명시적 타입**: 함수 반환 타입 명시
- **any 금지**: `any` 대신 `unknown` 또는 구체적인 타입 사용

### 네이밍 컨벤션

| 대상 | 스타일 | 예시 |
|------|--------|------|
| 변수/함수 | camelCase | `redisClient`, `initializeRedis()` |
| 상수 | UPPER_SNAKE_CASE | `LOG_LEVELS`, `DEFAULT_PORT` |
| 인터페이스 | PascalCase | `UserPayload`, `ChatMessage` |
| 타입 | PascalCase | `RedisClient`, `SocketData` |
| 파일 | kebab-case | `chat.handler.ts`, `auth.middleware.ts` |

### 예시

```typescript
// ✅ Good
interface UserPayload {
  id: string;
  email: string;
  nickname: string;
}

const initializeRedis = async (): Promise<Redis | null> => {
  // ...
};

// ❌ Bad
interface user_payload {
  id: any;
}

const init = async () => {
  // 반환 타입 누락, 함수명 불명확
};
```

---

## 파일 구조

### 모듈 패턴

각 폴더에는 `index.ts`를 통해 export를 관리합니다.

```typescript
// handlers/index.ts
export { registerChatHandlers } from './chat.handler.js';
export { registerPresenceHandlers } from './presence.handler.js';
export { registerNotificationHandlers } from './notification.handler.js';
```

### Import 순서

1. Node.js 내장 모듈
2. 외부 패키지
3. 내부 모듈 (절대 경로)
4. 내부 모듈 (상대 경로)

```typescript
// 1. Node.js 내장
import { randomUUID } from 'crypto';

// 2. 외부 패키지
import express from 'express';
import { Server } from 'socket.io';

// 3. 내부 모듈
import { config } from './config.js';
import { logger } from './services/index.js';
```

---

## Socket.IO 핸들러

### 핸들러 함수 시그니처

```typescript
export const registerXxxHandlers = (
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: AuthenticatedSocket
): void => {
  const user = socket.user!;

  socket.on('event_name', (payload: PayloadType) => {
    // 핸들러 로직
  });
};
```

### 이벤트 핸들링

```typescript
// ✅ Good - 페이로드 타입 명시
socket.on('send_message', (payload: SendMessagePayload) => {
  const { roomId, content, type = 'text' } = payload;
  // ...
});

// ❌ Bad - any 타입
socket.on('send_message', (payload: any) => {
  // ...
});
```

---

## 에러 처리

### 로깅

```typescript
// 정보 로그
logger.info('User joined room', { userId: user.id, roomId });

// 에러 로그
logger.error('Failed to process message', { 
  error: error instanceof Error ? error.message : 'Unknown error',
  userId: user.id 
});
```

### 클라이언트 에러 전송

```typescript
socket.emit('error', {
  code: 'MESSAGE_FAILED',
  message: 'Failed to send message'
});
```

---

## 주석

### JSDoc 스타일

```typescript
/**
 * Redis 클라이언트를 초기화합니다.
 * 
 * @returns Pub/Sub 클라이언트 쌍 또는 null (비활성화 시)
 */
export const initializeRedis = async (): Promise<{
  pubClient: Redis;
  subClient: Redis;
} | null> => {
  // ...
};
```

### 인라인 주석

```typescript
// 채팅방의 모든 사용자에게 메시지 브로드캐스트
io.to(roomId).emit('message', message);

// 발신자에게만 전송 확인
socket.emit('message_sent', { success: true, messageId });
```

---

## 커밋 메시지

### 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 타입

| 타입 | 설명 |
|------|------|
| `feat` | 새로운 기능 |
| `fix` | 버그 수정 |
| `docs` | 문서 변경 |
| `style` | 코드 포맷팅 |
| `refactor` | 리팩토링 |
| `test` | 테스트 추가/수정 |
| `chore` | 빌드/설정 변경 |

### 예시

```
feat(socket): add typing indicator support

- Add typing event handler
- Broadcast typing status to room members
- Add TypingPayload type definition

Closes #123
```

---

**최종 업데이트**: 2026년 1월 31일
