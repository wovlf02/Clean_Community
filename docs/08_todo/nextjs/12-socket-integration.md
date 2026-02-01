# Phase 12: Socket 서버 연동

**관련 문서**: [Socket 서버 문서](../../../socket_server/README.md) | [시스템 설계](../../03_architecture/system-design.md)

---

## 📋 개요

Express.js + Socket.IO 기반 소켓 서버(4000 포트)와 연동하여 실시간 채팅, 타이핑 인디케이터, 읽음 확인, 온라인 상태 기능을 구현합니다.

**예상 소요 시간**: 3일

**Socket 서버 정보**:
- URL: `http://localhost:4000`
- 프로토콜: Socket.IO

---

## ✅ 체크리스트

### 1. Socket.IO 클라이언트 설정

#### 1.1 환경 변수 확인

```env
# .env.local
NEXT_PUBLIC_SOCKET_SERVER_URL=http://localhost:4000
```

- [x] 환경 변수 설정

#### 1.2 Socket 클라이언트 설정

```typescript
// lib/socket.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
  }
  return socket;
}

export function connectSocket(userId: string, token?: string) {
  const socket = getSocket();
  
  socket.auth = { userId, token };
  socket.connect();

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
```

- [x] Socket.IO 클라이언트 설정
- [x] 연결/해제 함수

#### 1.3 Socket Provider

```typescript
// providers/socket-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket, connectSocket, disconnectSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/auth-store';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      const socket = connectSocket(user.id);
      setSocket(socket);

      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));

      return () => {
        disconnectSocket();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
```

- [x] SocketProvider 생성
- [x] useSocket 훅 생성
- [ ] RootLayout에 SocketProvider 추가

---

### 2. 실시간 채팅 연동

#### 2.1 채팅 이벤트 훅

```typescript
// hooks/use-chat-socket.ts
'use client';

import { useEffect, useCallback } from 'react';
import { useSocket } from '@/providers/socket-provider';
import { Message } from '@/types';
import { useChatStore } from '@/store/chat-store';

interface UseChatSocketOptions {
  roomId: string;
}

export function useChatSocket({ roomId }: UseChatSocketOptions) {
  const { socket, isConnected } = useSocket();
  const { addMessage, updateMessageRead, setTypingUsers } = useChatStore();

  // 채팅방 입장
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit('chat:join', { roomId });

    return () => {
      socket.emit('chat:leave', { roomId });
    };
  }, [socket, isConnected, roomId]);

  // 메시지 수신
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message: Message) => {
      addMessage(roomId, message);
    };

    socket.on('chat:message', handleMessage);

    return () => {
      socket.off('chat:message', handleMessage);
    };
  }, [socket, roomId, addMessage]);

  // 메시지 읽음 처리 수신
  useEffect(() => {
    if (!socket) return;

    const handleRead = ({ messageIds }: { messageIds: string[] }) => {
      messageIds.forEach((id) => updateMessageRead(roomId, id));
    };

    socket.on('chat:read', handleRead);

    return () => {
      socket.off('chat:read', handleRead);
    };
  }, [socket, roomId, updateMessageRead]);

  // 타이핑 상태 수신
  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
      setTypingUsers(roomId, userId, isTyping);
    };

    socket.on('chat:typing', handleTyping);

    return () => {
      socket.off('chat:typing', handleTyping);
    };
  }, [socket, roomId, setTypingUsers]);

  // 메시지 전송
  const sendMessage = useCallback(
    (content: string, type: 'text' | 'image' | 'emoji' = 'text') => {
      if (!socket) return;

      socket.emit('chat:message', { roomId, content, type });
    },
    [socket, roomId]
  );

  // 타이핑 상태 전송
  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!socket) return;

      socket.emit('chat:typing', { roomId, isTyping });
    },
    [socket, roomId]
  );

  // 메시지 읽음 처리
  const markAsRead = useCallback(
    (messageIds: string[]) => {
      if (!socket) return;

      socket.emit('chat:read', { roomId, messageIds });
    },
    [socket, roomId]
  );

  return {
    sendMessage,
    sendTyping,
    markAsRead,
    isConnected,
  };
}
```

- [x] useChatSocket 훅 생성
- [x] 채팅방 입장/퇴장 이벤트
- [x] 메시지 송수신 이벤트
- [x] 읽음 확인 이벤트

---

### 3. 타이핑 인디케이터

#### 3.1 TypingIndicator 컴포넌트

```css
/* components/chat/typing-indicator/typing-indicator.css */

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  font-size: 0.75rem;
  color: rgb(var(--muted-foreground));
}

.typing-indicator__dots {
  display: flex;
  gap: 0.125rem;
}

.typing-indicator__dot {
  width: 0.375rem;
  height: 0.375rem;
  background-color: rgb(var(--muted-foreground));
  border-radius: 9999px;
  animation: typing-bounce 1.4s ease-in-out infinite both;
}

.typing-indicator__dot:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator__dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator__dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-bounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
```

```typescript
// components/chat/typing-indicator/typing-indicator.tsx
'use client';

import { useChatStore } from '@/store/chat-store';
import './typing-indicator.css';

interface TypingIndicatorProps {
  roomId: string;
}

export function TypingIndicator({ roomId }: TypingIndicatorProps) {
  const typingUsers = useChatStore((state) => state.typingUsers[roomId] || []);

  if (typingUsers.length === 0) return null;

  const text =
    typingUsers.length === 1
      ? `${typingUsers[0]}님이 입력 중...`
      : `${typingUsers.length}명이 입력 중...`;

  return (
    <div className="typing-indicator">
      <div className="typing-indicator__dots">
        <span className="typing-indicator__dot" />
        <span className="typing-indicator__dot" />
        <span className="typing-indicator__dot" />
      </div>
      <span>{text}</span>
    </div>
  );
}
```

- [ ] typing-indicator.css 파일 생성
- [x] TypingIndicator 컴포넌트 생성
- [x] 애니메이션 도트 구현

#### 3.2 입력 시 타이핑 상태 전송

```typescript
// ChatInput 컴포넌트에서 사용
const { sendTyping } = useChatSocket({ roomId });
const typingTimeoutRef = useRef<NodeJS.Timeout>();

const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  setValue(e.target.value);

  // 타이핑 시작 알림
  sendTyping(true);

  // 2초 동안 입력 없으면 타이핑 종료 알림
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }

  typingTimeoutRef.current = setTimeout(() => {
    sendTyping(false);
  }, 2000);
};
```

- [x] 타이핑 상태 자동 전송

---

### 4. 읽음 확인 연동

```typescript
// 채팅방 진입 시 또는 스크롤 시 읽음 처리
useEffect(() => {
  if (messages.length > 0) {
    const unreadMessageIds = messages
      .filter((m) => !m.isRead && m.senderId !== currentUserId)
      .map((m) => m.id);

    if (unreadMessageIds.length > 0) {
      markAsRead(unreadMessageIds);
    }
  }
}, [messages, currentUserId, markAsRead]);
```

- [x] 읽음 처리 로직 구현
- [x] 읽음 상태 UI 업데이트

---

### 5. 온라인 상태 연동

#### 5.1 온라인 상태 훅

```typescript
// hooks/use-online-status.ts
'use client';

import { useEffect } from 'react';
import { useSocket } from '@/providers/socket-provider';
import { useFriendsStore } from '@/store/friends-store';

export function useOnlineStatus() {
  const { socket } = useSocket();
  const { setUserOnline, setUserOffline } = useFriendsStore();

  useEffect(() => {
    if (!socket) return;

    const handleUserOnline = ({ userId }: { userId: string }) => {
      setUserOnline(userId);
    };

    const handleUserOffline = ({ userId }: { userId: string }) => {
      setUserOffline(userId);
    };

    socket.on('user:online', handleUserOnline);
    socket.on('user:offline', handleUserOffline);

    return () => {
      socket.off('user:online', handleUserOnline);
      socket.off('user:offline', handleUserOffline);
    };
  }, [socket, setUserOnline, setUserOffline]);
}
```

- [x] useOnlineStatus 훅 생성
- [x] 온라인 상태 Store 업데이트

---

### 6. 실시간 알림 연동

```typescript
// hooks/use-notifications-socket.ts
'use client';

import { useEffect } from 'react';
import { useSocket } from '@/providers/socket-provider';
import { useNotificationStore } from '@/store/notification-store';
import { showToast } from '@/lib/toast';

export function useNotificationsSocket() {
  const { socket } = useSocket();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: Notification) => {
      addNotification(notification);
      showToast.info(notification.title, notification.message);
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket, addNotification]);
}
```

- [x] useNotificationsSocket 훅 생성
- [x] 실시간 토스트 알림

---

## 📁 생성되는 파일 목록

```
cc/src/
├── lib/
│   └── socket.ts
├── providers/
│   └── socket-provider.tsx
├── hooks/
│   ├── use-chat-socket.ts
│   ├── use-online-status.ts
│   └── use-notifications-socket.ts
├── store/
│   ├── chat-store.ts (수정)
│   ├── friends-store.ts (수정)
│   └── notification-store.ts
└── components/chat/
    └── typing-indicator/
        ├── typing-indicator.tsx
        ├── typing-indicator.css
        └── index.ts
```

---

## 🔌 Socket 이벤트 목록

### 클라이언트 → 서버

| 이벤트 | 설명 | 데이터 |
|--------|------|--------|
| `chat:join` | 채팅방 입장 | `{ roomId }` |
| `chat:leave` | 채팅방 퇴장 | `{ roomId }` |
| `chat:message` | 메시지 전송 | `{ roomId, content, type }` |
| `chat:typing` | 타이핑 상태 | `{ roomId, isTyping }` |
| `chat:read` | 읽음 처리 | `{ roomId, messageIds }` |

### 서버 → 클라이언트

| 이벤트 | 설명 | 데이터 |
|--------|------|--------|
| `chat:message` | 메시지 수신 | `Message` |
| `chat:typing` | 타이핑 상태 수신 | `{ userId, isTyping }` |
| `chat:read` | 읽음 상태 수신 | `{ messageIds }` |
| `user:online` | 온라인 상태 | `{ userId }` |
| `user:offline` | 오프라인 상태 | `{ userId }` |
| `notification` | 알림 | `Notification` |

---

## ✅ 완료 조건

- [x] Socket.IO 클라이언트 설정 완료
- [x] SocketProvider 구현 및 적용
- [x] 실시간 채팅 메시지 송수신 동작
- [x] 타이핑 인디케이터 동작
- [x] 읽음 확인 동작
- [x] 온라인 상태 동작
- [x] 실시간 알림 동작
- [x] Socket 서버 연결 테스트 완료
- [x] 프로젝트 빌드 성공 (`npm run build`)

---

**이전 단계**: [Phase 11: AI 서버 연동](./11-ai-integration.md)

**다음 단계**: [Phase 13: 최적화 및 마무리](./13-optimization.md)
