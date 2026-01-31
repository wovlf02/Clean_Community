# Socket.IO 이벤트

**관련 문서**: [REST API](./rest-api.md) | [타입 정의](./types.md)

---

## 연결

### 인증

Socket.IO 연결 시 JWT 토큰이 필요합니다.

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### 연결 에러

| 에러 메시지 | 설명 |
|-------------|------|
| `Authentication required` | 토큰이 제공되지 않음 |
| `Invalid token` | 토큰이 유효하지 않거나 만료됨 |

---

## 클라이언트 → 서버 이벤트

### 1. join_room

채팅방에 입장합니다.

```typescript
socket.emit('join_room', { roomId: 'room-uuid' });
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `roomId` | string | ✅ | 채팅방 ID |

---

### 2. leave_room

채팅방에서 퇴장합니다.

```typescript
socket.emit('leave_room', { roomId: 'room-uuid' });
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `roomId` | string | ✅ | 채팅방 ID |

---

### 3. send_message

메시지를 전송합니다.

```typescript
socket.emit('send_message', {
  roomId: 'room-uuid',
  content: '안녕하세요!',
  type: 'text'
});
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `roomId` | string | ✅ | 채팅방 ID |
| `content` | string | ✅ | 메시지 내용 |
| `type` | string | ❌ | 메시지 타입 (`text`, `image`) 기본값: `text` |

---

### 4. typing

타이핑 상태를 전송합니다.

```typescript
socket.emit('typing', {
  roomId: 'room-uuid',
  isTyping: true
});
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `roomId` | string | ✅ | 채팅방 ID |
| `isTyping` | boolean | ✅ | 타이핑 중 여부 |

---

### 5. read_message

메시지 읽음 처리를 합니다.

```typescript
socket.emit('read_message', {
  roomId: 'room-uuid',
  messageId: 'message-uuid'
});
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `roomId` | string | ✅ | 채팅방 ID |
| `messageId` | string | ✅ | 메시지 ID |

---

### 6. update_presence

온라인 상태를 업데이트합니다.

```typescript
socket.emit('update_presence', 'away');
```

| 값 | 설명 |
|------|------|
| `online` | 온라인 |
| `away` | 자리비움 |

---

## 서버 → 클라이언트 이벤트

### 1. message

새 메시지를 수신합니다.

```typescript
socket.on('message', (message) => {
  console.log(message);
});
```

**페이로드:**

```typescript
{
  id: string;           // 메시지 UUID
  roomId: string;       // 채팅방 ID
  senderId: string;     // 발신자 ID
  senderNickname: string; // 발신자 닉네임
  content: string;      // 메시지 내용
  type: 'text' | 'image' | 'system';
  createdAt: string;    // ISO 8601
  emotionLabel?: string; // AI 감정분석 결과 (선택)
}
```

---

### 2. message_sent

메시지 전송 확인을 받습니다.

```typescript
socket.on('message_sent', (data) => {
  console.log(data);
});
```

**페이로드:**

```typescript
{
  success: boolean;     // 성공 여부
  messageId: string;    // 생성된 메시지 ID
}
```

---

### 3. typing

다른 사용자의 타이핑 상태를 수신합니다.

```typescript
socket.on('typing', (data) => {
  console.log(data);
});
```

**페이로드:**

```typescript
{
  userId: string;       // 타이핑 중인 사용자 ID
  nickname: string;     // 닉네임
  isTyping: boolean;    // 타이핑 중 여부
}
```

---

### 4. user_joined

사용자가 채팅방에 입장했음을 알립니다.

```typescript
socket.on('user_joined', (data) => {
  console.log(data);
});
```

**페이로드:**

```typescript
{
  userId: string;       // 입장한 사용자 ID
  nickname: string;     // 닉네임
}
```

---

### 5. user_left

사용자가 채팅방에서 퇴장했음을 알립니다.

```typescript
socket.on('user_left', (data) => {
  console.log(data);
});
```

**페이로드:**

```typescript
{
  userId: string;       // 퇴장한 사용자 ID
  nickname: string;     // 닉네임
}
```

---

### 6. message_read

메시지 읽음 확인을 수신합니다.

```typescript
socket.on('message_read', (data) => {
  console.log(data);
});
```

**페이로드:**

```typescript
{
  userId: string;       // 읽은 사용자 ID
  messageId: string;    // 읽은 메시지 ID
}
```

---

### 7. notification

실시간 알림을 수신합니다.

```typescript
socket.on('notification', (notification) => {
  console.log(notification);
});
```

**페이로드:**

```typescript
{
  id: string;           // 알림 ID
  type: 'message' | 'friend_request' | 'like' | 'comment' | 'system';
  title: string;        // 알림 제목
  content: string;      // 알림 내용
  createdAt: string;    // ISO 8601
  isRead: boolean;      // 읽음 여부
}
```

---

### 8. presence_update

사용자의 온라인 상태 변경을 수신합니다.

```typescript
socket.on('presence_update', (update) => {
  console.log(update);
});
```

**페이로드:**

```typescript
{
  userId: string;       // 사용자 ID
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;    // 마지막 접속 시간 (offline인 경우)
}
```

---

### 9. error

에러를 수신합니다.

```typescript
socket.on('error', (error) => {
  console.error(error);
});
```

**페이로드:**

```typescript
{
  code: string;         // 에러 코드
  message: string;      // 에러 메시지
}
```

---

**최종 업데이트**: 2026년 1월 31일
