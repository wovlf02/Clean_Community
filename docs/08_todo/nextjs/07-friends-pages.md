# Phase 7: 친구 관리 화면 개발

**관련 문서**: [친구 화면 설계](../../05_screens/04_friends/) | [기능 요구사항 FR-29~34](../../02_requirements/functional.md)

---

## 📋 개요

친구 목록, 친구 검색, 친구 요청 관리 화면을 Mock 데이터 기반으로 구현합니다.

**예상 소요 시간**: 2일

---

## ✅ 체크리스트

### 1. 친구 Mock 데이터

```typescript
// mocks/friends.ts
import { Friend, FriendRequest } from '@/types';
import { mockUsers } from './users';

export const mockFriends: Friend[] = [
  {
    id: 'friend-1',
    userId: 'user-1',
    friendId: 'user-2',
    friend: mockUsers[1],
    createdAt: '2024-01-01T00:00:00Z',
  },
  // ... 더 많은 친구
];

export const mockFriendRequests: FriendRequest[] = [
  {
    id: 'request-1',
    senderId: 'user-3',
    sender: mockUsers[2],
    receiverId: 'user-1',
    status: 'pending',
    createdAt: '2024-01-15T10:00:00Z',
  },
  // ... 더 많은 친구 요청
];
```

- [x] 친구 Mock 데이터 생성
- [x] 친구 요청 Mock 데이터 생성

---

### 2. 친구 목록 페이지 (/friends)

#### 2.1 FriendCard 컴포넌트

```css
/* components/friends/friend-card/friend-card.css */

.friend-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: background-color 150ms ease-out;
}

.friend-card:hover {
  background-color: rgb(var(--accent));
}

.friend-card__info {
  flex: 1;
  min-width: 0;
}

.friend-card__name {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--foreground));
}

.friend-card__status {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: rgb(var(--muted-foreground));
}

.friend-card__status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
}

.friend-card__status-dot--online {
  background-color: rgb(34 197 94);
}

.friend-card__status-dot--offline {
  background-color: rgb(156 163 175);
}

.friend-card__actions {
  display: flex;
  gap: 0.25rem;
}
```

- [x] friend-card.css 파일 생성
- [x] FriendCard 컴포넌트 생성
- [x] 온라인 상태 표시
- [x] 채팅 시작 버튼
- [x] 친구 삭제 버튼

#### 2.2 친구 요청 카드 컴포넌트

- [x] FriendRequestCard 컴포넌트
- [x] 수락/거절 버튼

#### 2.3 친구 목록 페이지

```typescript
// app/(main)/friends/page.tsx
'use client';

import { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FriendCard } from '@/components/friends/friend-card';
import { FriendRequestCard } from '@/components/friends/friend-request-card';
import { EmptyState } from '@/components/common/empty-state';
import { mockFriends, mockFriendRequests } from '@/mocks/friends';
import './friends.css';

export default function FriendsPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const pendingRequests = mockFriendRequests.filter(
    (r) => r.status === 'pending'
  );

  const filteredFriends = mockFriends.filter((f) =>
    f.friend.nickname.toLowerCase().includes(search.toLowerCase())
  );

  const onlineFriends = filteredFriends.filter((f) => f.friend.isOnline);

  return (
    <div className="friends-page">
      {/* 헤더 */}
      <div className="friends-page__header">
        <h1 className="friends-page__title">친구</h1>
        <Button leftIcon={<UserPlus className="h-4 w-4" />}>
          친구 추가
        </Button>
      </div>

      {/* 검색 */}
      <Input
        placeholder="친구 검색..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        leftIcon={<Search className="h-4 w-4" />}
        className="friends-page__search"
      />

      {/* 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            전체 ({filteredFriends.length})
          </TabsTrigger>
          <TabsTrigger value="online">
            온라인 ({onlineFriends.length})
          </TabsTrigger>
          <TabsTrigger value="requests">
            요청 ({pendingRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {filteredFriends.length > 0 ? (
            <div className="friends-page__list">
              {filteredFriends.map((friend) => (
                <FriendCard key={friend.id} friend={friend} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="친구가 없습니다"
              description="새로운 친구를 추가해보세요!"
            />
          )}
        </TabsContent>

        <TabsContent value="online">
          {/* 온라인 친구 목록 */}
        </TabsContent>

        <TabsContent value="requests">
          {/* 친구 요청 목록 */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

- [x] friends.css 파일 생성
- [x] 친구 목록 페이지 구현
- [x] 탭 (전체, 온라인, 요청)
- [x] 친구 검색

---

### 3. 친구 검색 페이지 (/friends/search)

- [x] 사용자 검색 (닉네임, 이메일)
- [x] 검색 결과 카드
- [x] 친구 요청 보내기 버튼
- [x] 이미 친구인 경우 표시

---

## 📁 생성되는 파일 목록

```
cc/src/
├── app/(main)/
│   └── friends/
│       ├── page.tsx
│       ├── friends.css
│       └── search/
│           ├── page.tsx
│           └── search.css
├── components/friends/
│   ├── friend-card/
│   ├── friend-request-card/
│   └── user-search-card/
└── mocks/
    └── friends.ts
```

---

## ✅ 완료 조건

- [x] 친구 Mock 데이터 생성
- [x] 친구 목록 페이지 완료
- [x] 친구 요청 관리 UI 완료
- [x] 친구 검색 페이지 완료
- [x] 온라인 상태 표시
- [x] 채팅 시작 기능 연동 (링크)
- [x] 프로젝트 빌드 성공 (`npm run build`)

---

**이전 단계**: [Phase 6: 채팅 화면 개발](./06-chat-pages.md)

**다음 단계**: [Phase 8: 대시보드 화면 개발](./08-dashboard-pages.md)
