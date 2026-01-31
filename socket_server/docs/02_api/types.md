# 타입 정의

**관련 문서**: [REST API](./rest-api.md) | [Socket.IO 이벤트](./socket-events.md)

---

## 개요

Socket Server에서 사용하는 TypeScript 타입 정의입니다.

파일 위치: `src/types/socket.types.ts`

---

## 사용자 관련 타입

### UserPayload

JWT에서 추출한 사용자 정보입니다.

```typescript
interface UserPayload {
  id: string;           // 사용자 고유 ID
  email: string;        // 이메일
  nickname: string;     // 닉네임
}
```

### AuthenticatedSocket

사용자 정보가 포함된 확장 Socket 타입입니다.

```typescript
interface AuthenticatedSocket extends Socket {
  user?: UserPayload;   // 인증된 사용자 정보
}
```

---

## 메시지 관련 타입

### ChatMessage

채팅 메시지 객체입니다.

```typescript
interface ChatMessage {
  id: string;                           // 메시지 UUID
  roomId: string;                       // 채팅방 ID
  senderId: string;                     // 발신자 ID
  senderNickname: string;               // 발신자 닉네임
  content: string;                      // 메시지 내용
  type: 'text' | 'image' | 'system';    // 메시지 타입
  createdAt: string;                    // ISO 8601 형식
  emotionLabel?: string;                // AI 감정분석 결과 (선택)
}
```

---

## 이벤트 페이로드 타입

### 채팅방 관련

```typescript
interface JoinRoomPayload {
  roomId: string;       // 입장할 채팅방 ID
}

interface LeaveRoomPayload {
  roomId: string;       // 퇴장할 채팅방 ID
}
```

### 메시지 관련

```typescript
interface SendMessagePayload {
  roomId: string;               // 채팅방 ID
  content: string;              // 메시지 내용
  type?: 'text' | 'image';      // 메시지 타입 (기본: text)
}

interface TypingPayload {
  roomId: string;       // 채팅방 ID
  isTyping: boolean;    // 타이핑 중 여부
}

interface ReadMessagePayload {
  roomId: string;       // 채팅방 ID
  messageId: string;    // 메시지 ID
}
```

---

## 알림 타입

### Notification

```typescript
interface Notification {
  id: string;           // 알림 ID
  type: 'message' | 'friend_request' | 'like' | 'comment' | 'system';
  title: string;        // 알림 제목
  content: string;      // 알림 내용
  createdAt: string;    // ISO 8601 형식
  isRead: boolean;      // 읽음 여부
}
```

---

## 프레즌스 타입

### PresenceUpdate

```typescript
interface PresenceUpdate {
  userId: string;                       // 사용자 ID
  status: 'online' | 'offline' | 'away'; // 상태
  lastSeen?: string;                    // 마지막 접속 시간 (ISO 8601)
}
```

---

## Socket.IO 이벤트 인터페이스

### ServerToClientEvents

서버에서 클라이언트로 보내는 이벤트입니다.

```typescript
interface ServerToClientEvents {
  // 채팅
  message: (message: ChatMessage) => void;
  message_sent: (data: { success: boolean; messageId: string }) => void;
  typing: (data: { userId: string; nickname: string; isTyping: boolean }) => void;
  user_joined: (data: { userId: string; nickname: string }) => void;
  user_left: (data: { userId: string; nickname: string }) => void;
  message_read: (data: { userId: string; messageId: string }) => void;
  
  // 알림
  notification: (notification: Notification) => void;
  
  // 프레즌스
  presence_update: (update: PresenceUpdate) => void;
  
  // 에러
  error: (error: { code: string; message: string }) => void;
}
```

### ClientToServerEvents

클라이언트에서 서버로 보내는 이벤트입니다.

```typescript
interface ClientToServerEvents {
  // 채팅
  join_room: (payload: JoinRoomPayload) => void;
  leave_room: (payload: LeaveRoomPayload) => void;
  send_message: (payload: SendMessagePayload) => void;
  typing: (payload: TypingPayload) => void;
  read_message: (payload: ReadMessagePayload) => void;
  
  // 프레즌스
  update_presence: (status: 'online' | 'away') => void;
}
```

### InterServerEvents

서버 간 통신 이벤트입니다 (Redis Adapter 사용 시).

```typescript
interface InterServerEvents {
  ping: () => void;
}
```

### SocketData

소켓에 저장되는 데이터입니다.

```typescript
interface SocketData {
  user: UserPayload;    // 사용자 정보
  rooms: Set<string>;   // 참여 중인 채팅방 목록
}
```

---

**최종 업데이트**: 2026년 1월 31일
