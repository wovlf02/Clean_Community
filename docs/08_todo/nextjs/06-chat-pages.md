# Phase 6: 채팅 화면 개발

**관련 문서**: [채팅 화면 설계](../../05_screens/03_chat/) | [기능 요구사항 FR-21~28](../../02_requirements/functional.md)

---

## 📋 개요

채팅방 목록, 채팅방 화면을 Mock 데이터 기반으로 구현합니다.

**예상 소요 시간**: 3일

---

## ✅ 체크리스트

### 1. 채팅 Mock 데이터

#### 1.1 채팅방 Mock 데이터

```typescript
// mocks/chat-rooms.ts
import { ChatRoom } from '@/types';
import { mockUsers } from './users';

export const mockChatRooms: ChatRoom[] = [
  {
    id: 'room-1',
    type: 'direct',
    name: undefined,
    participants: [mockUsers[0], mockUsers[1]],
    lastMessage: {
      id: 'msg-100',
      roomId: 'room-1',
      senderId: 'user-2',
      sender: mockUsers[1],
      content: '안녕하세요! 반가워요',
      type: 'text',
      isRead: false,
      createdAt: '2024-01-15T14:30:00Z',
    },
    unreadCount: 2,
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'room-2',
    type: 'group',
    name: '개발자 모임',
    participants: [mockUsers[0], mockUsers[1], mockUsers[2]],
    lastMessage: {
      id: 'msg-200',
      roomId: 'room-2',
      senderId: 'user-3',
      sender: mockUsers[2],
      content: '다음 미팅은 언제인가요?',
      type: 'text',
      isRead: true,
      createdAt: '2024-01-15T12:00:00Z',
    },
    unreadCount: 0,
    createdAt: '2024-01-05T00:00:00Z',
  },
];
```

#### 1.2 메시지 Mock 데이터

```typescript
// mocks/messages.ts
import { Message } from '@/types';
import { mockUsers } from './users';

export const mockMessages: Record<string, Message[]> = {
  'room-1': [
    {
      id: 'msg-1',
      roomId: 'room-1',
      senderId: 'user-2',
      sender: mockUsers[1],
      content: '안녕하세요!',
      type: 'text',
      isRead: true,
      createdAt: '2024-01-15T14:00:00Z',
    },
    {
      id: 'msg-2',
      roomId: 'room-1',
      senderId: 'user-1',
      sender: mockUsers[0],
      content: '네, 안녕하세요! 반갑습니다 😊',
      type: 'text',
      isRead: true,
      createdAt: '2024-01-15T14:05:00Z',
    },
    // ... 더 많은 메시지
  ],
};
```

- [x] 채팅방 Mock 데이터 생성
- [x] 메시지 Mock 데이터 생성
- [ ] 채팅 Store 생성

---

### 2. 채팅방 목록 페이지 (/chat)

#### 2.1 ChatRoomItem 컴포넌트

```css
/* components/chat/chat-room-item/chat-room-item.css */

.chat-room-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 150ms ease-out;
  border-radius: 0.5rem;
}

.chat-room-item:hover {
  background-color: rgb(var(--accent));
}

.chat-room-item--active {
  background-color: rgb(var(--accent));
}

.chat-room-item__avatar {
  position: relative;
  flex-shrink: 0;
}

/* 그룹 채팅 아바타 (겹쳐진 형태) */
.chat-room-item__avatar--group {
  display: flex;
}

.chat-room-item__avatar--group > *:not(:first-child) {
  margin-left: -0.5rem;
}

.chat-room-item__content {
  flex: 1;
  min-width: 0;
}

.chat-room-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.chat-room-item__name {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--foreground));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-room-item__time {
  font-size: 0.75rem;
  color: rgb(var(--muted-foreground));
  flex-shrink: 0;
}

.chat-room-item__message {
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-room-item__unread {
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
  color: white;
  background-color: rgb(var(--primary));
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
```

```typescript
// components/chat/chat-room-item/chat-room-item.tsx
'use client';

import { ChatRoom } from '@/types';
import { UserAvatar } from '@/components/common/user-avatar';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import './chat-room-item.css';

interface ChatRoomItemProps {
  room: ChatRoom;
  currentUserId: string;
  isActive?: boolean;
  onClick: () => void;
}

export function ChatRoomItem({
  room,
  currentUserId,
  isActive,
  onClick,
}: ChatRoomItemProps) {
  const otherParticipants = room.participants.filter(
    (p) => p.id !== currentUserId
  );

  const displayName =
    room.type === 'group'
      ? room.name
      : otherParticipants[0]?.nickname || '알 수 없음';

  return (
    <div
      className={cn('chat-room-item', isActive && 'chat-room-item--active')}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* 아바타 */}
      <div className="chat-room-item__avatar">
        {room.type === 'direct' ? (
          <UserAvatar
            src={otherParticipants[0]?.image}
            name={otherParticipants[0]?.nickname || '?'}
            isOnline={otherParticipants[0]?.isOnline}
          />
        ) : (
          <div className="chat-room-item__avatar--group">
            {otherParticipants.slice(0, 2).map((p) => (
              <UserAvatar key={p.id} src={p.image} name={p.nickname} size="sm" />
            ))}
          </div>
        )}
      </div>

      {/* 내용 */}
      <div className="chat-room-item__content">
        <div className="chat-room-item__header">
          <span className="chat-room-item__name">{displayName}</span>
          {room.lastMessage && (
            <span className="chat-room-item__time">
              {formatRelativeTime(room.lastMessage.createdAt)}
            </span>
          )}
        </div>
        {room.lastMessage && (
          <p className="chat-room-item__message">{room.lastMessage.content}</p>
        )}
      </div>

      {/* 읽지 않은 메시지 수 */}
      {room.unreadCount > 0 && (
        <span className="chat-room-item__unread">
          {room.unreadCount > 99 ? '99+' : room.unreadCount}
        </span>
      )}
    </div>
  );
}
```

- [x] chat-room-item.css 파일 생성
- [x] ChatRoomItem 컴포넌트 생성
- [x] 그룹 채팅 아바타 표시

#### 2.2 채팅방 목록 페이지

- [x] chat-list.css 파일 생성
- [x] 채팅방 목록 표시
- [x] 채팅방 검색
- [x] 새 채팅 생성 버튼

---

### 3. 채팅방 페이지 (/chat/[id])

#### 3.1 메시지 버블 컴포넌트

```css
/* components/chat/message-bubble/message-bubble.css */

.message-bubble {
  display: flex;
  gap: 0.5rem;
  max-width: 75%;
}

.message-bubble--own {
  flex-direction: row-reverse;
  margin-left: auto;
}

.message-bubble__avatar {
  flex-shrink: 0;
  align-self: flex-end;
}

.message-bubble__content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.message-bubble--own .message-bubble__content {
  align-items: flex-end;
}

.message-bubble__sender {
  font-size: 0.75rem;
  color: rgb(var(--muted-foreground));
  margin-bottom: 0.125rem;
}

.message-bubble__body {
  padding: 0.625rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  word-break: break-word;
}

/* 상대방 메시지 */
.message-bubble:not(.message-bubble--own) .message-bubble__body {
  background-color: rgb(var(--muted));
  color: rgb(var(--foreground));
  border-bottom-left-radius: 0.25rem;
}

/* 내 메시지 */
.message-bubble--own .message-bubble__body {
  background-color: rgb(var(--primary));
  color: rgb(var(--primary-foreground));
  border-bottom-right-radius: 0.25rem;
}

.message-bubble__meta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.625rem;
  color: rgb(var(--muted-foreground));
}

.message-bubble__read {
  color: rgb(var(--primary));
}

/* AI 감정분석 배지 */
.message-bubble__sentiment {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.375rem;
  font-size: 0.625rem;
  border-radius: 9999px;
  background-color: rgb(var(--muted));
}

.message-bubble__sentiment--warning {
  background-color: rgb(254 243 199);
  color: rgb(146 64 14);
}
```

```typescript
// components/chat/message-bubble/message-bubble.tsx
'use client';

import { Message } from '@/types';
import { UserAvatar } from '@/components/common/user-avatar';
import { Check, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import './message-bubble.css';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  showSender?: boolean;
}

export function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  showSender = false,
}: MessageBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={cn('message-bubble', isOwn && 'message-bubble--own')}>
      {/* 아바타 (상대방만) */}
      {!isOwn && showAvatar && (
        <div className="message-bubble__avatar">
          <UserAvatar
            src={message.sender.image}
            name={message.sender.nickname}
            size="sm"
          />
        </div>
      )}

      <div className="message-bubble__content">
        {/* 발신자 이름 (그룹 채팅) */}
        {!isOwn && showSender && (
          <span className="message-bubble__sender">
            {message.sender.nickname}
          </span>
        )}

        {/* 메시지 본문 */}
        <div className="message-bubble__body">{message.content}</div>

        {/* 메타 정보 */}
        <div className="message-bubble__meta">
          <span>{time}</span>
          {isOwn && (
            <span className={cn(message.isRead && 'message-bubble__read')}>
              {message.isRead ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [x] message-bubble.css 파일 생성
- [x] MessageBubble 컴포넌트 생성
- [x] 읽음 표시 아이콘 (체크, 더블체크)
- [ ] AI 감정분석 배지 표시

#### 3.2 채팅 입력 컴포넌트

```css
/* components/chat/chat-input/chat-input.css */

.chat-input {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid rgb(var(--border));
  background-color: rgb(var(--background));
}

.chat-input__textarea {
  flex: 1;
  max-height: 120px;
  padding: 0.75rem 1rem;
  border: 1px solid rgb(var(--border));
  border-radius: 1.5rem;
  font-size: 0.875rem;
  resize: none;
  background-color: rgb(var(--background));
  transition: border-color 150ms ease-out;
}

.chat-input__textarea:focus {
  outline: none;
  border-color: rgb(var(--primary));
}

.chat-input__actions {
  display: flex;
  gap: 0.25rem;
}

.chat-input__action-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  color: rgb(var(--muted-foreground));
  transition: all 150ms ease-out;
}

.chat-input__action-btn:hover {
  background-color: rgb(var(--accent));
  color: rgb(var(--foreground));
}

.chat-input__send-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: rgb(var(--primary));
  color: rgb(var(--primary-foreground));
  transition: all 150ms ease-out;
}

.chat-input__send-btn:hover {
  opacity: 0.9;
}

.chat-input__send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

- [x] chat-input.css 파일 생성
- [x] ChatInput 컴포넌트 생성
- [x] 텍스트 입력 (자동 높이 조절)
- [x] 이모지/이미지 첨부 버튼
- [x] 전송 버튼

#### 3.3 채팅방 페이지

- [x] chat-room.css 파일 생성
- [x] 메시지 목록 표시
- [x] 날짜 구분선
- [x] 타이핑 인디케이터 UI
- [x] 스크롤 (최신 메시지로)

---

### 4. 채팅방 생성 모달

- [x] 1:1 채팅: 친구 선택
- [x] 그룹 채팅: 여러 친구 선택 + 방 이름
- [x] 참여자 검색

---

## 📁 생성되는 파일 목록

```
cc/src/
├── app/(main)/
│   └── chat/
│       ├── page.tsx
│       ├── chat-list.css
│       └── [id]/
│           ├── page.tsx
│           └── chat-room.css
├── components/chat/
│   ├── chat-room-item/
│   │   ├── chat-room-item.tsx
│   │   ├── chat-room-item.css
│   │   └── index.ts
│   ├── message-bubble/
│   │   ├── message-bubble.tsx
│   │   ├── message-bubble.css
│   │   └── index.ts
│   ├── chat-input/
│   │   ├── chat-input.tsx
│   │   ├── chat-input.css
│   │   └── index.ts
│   ├── create-chat-modal/
│   └── typing-indicator/
├── mocks/
│   ├── chat-rooms.ts
│   └── messages.ts
└── store/
    └── chat-store.ts
```

---

## ✅ 완료 조건

- [x] 채팅 Mock 데이터 생성
- [x] 채팅방 목록 페이지 완료
- [x] 채팅방 페이지 완료
- [x] 메시지 버블 컴포넌트 완료
- [x] 채팅 입력 컴포넌트 완료
- [x] 채팅방 생성 모달 완료
- [x] 읽음 표시 UI 완료
- [x] 프로젝트 빌드 성공 (`npm run build`)

---

**이전 단계**: [Phase 5: 게시판 화면 개발](./05-board-pages.md)

**다음 단계**: [Phase 7: 친구 관리 화면 개발](./07-friends-pages.md)
