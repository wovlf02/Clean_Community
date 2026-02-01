'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FriendCard } from '@/components/friends/friend-card';
import { FriendRequestCard } from '@/components/friends/friend-request-card';
import { EmptyState } from '@/components/common/empty-state';
import { AddFriendModal } from '@/components/friends/add-friend-modal';
import { friends, friendRequests } from '@/mocks/friends';
import { chatRooms } from '@/mocks/chat-rooms';
import { showToast } from '@/lib/toast';
import './friends.css';

export default function FriendsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const pendingRequests = friendRequests.filter((r) => r.status === 'pending');

  const filteredFriends = useMemo(() => {
    if (!search) return friends;
    const searchLower = search.toLowerCase();
    return friends.filter((f) =>
      f.friend.nickname.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const onlineFriends = useMemo(() => {
    return filteredFriends.filter((f) => f.friend.isOnline);
  }, [filteredFriends]);

  // 채팅 시작 핸들러
  const handleStartChat = (friendId: string, friendNickname: string) => {
    // 기존 1:1 채팅방 검색
    const existingRoom = chatRooms.find(
      (room) =>
        room.type === 'direct' &&
        room.participants.some((p) => p.id === friendId)
    );

    if (existingRoom) {
      // 기존 채팅방으로 이동
      router.push(`/chat?roomId=${existingRoom.id}`);
    } else {
      // 새 채팅방 생성 (실제로는 API 호출)
      showToast.success('채팅방 생성', `${friendNickname}님과의 채팅방을 생성했습니다.`);
      // 임시로 첫 번째 채팅방으로 이동
      router.push('/chat?roomId=room-1');
    }
  };

  return (
    <div className="friends-page">
      {/* 헤더 */}
      <div className="friends-page__header">
        <h1 className="friends-page__title">친구</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
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
          <TabsTrigger value="all">전체 ({filteredFriends.length})</TabsTrigger>
          <TabsTrigger value="online">온라인 ({onlineFriends.length})</TabsTrigger>
          <TabsTrigger value="requests">요청 ({pendingRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {filteredFriends.length > 0 ? (
            <div className="friends-page__list">
              {filteredFriends.map((friend) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  onStartChat={handleStartChat}
                />
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
          {onlineFriends.length > 0 ? (
            <div className="friends-page__list">
              {onlineFriends.map((friend) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  onStartChat={handleStartChat}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="온라인 친구가 없습니다"
              description="친구들이 접속하면 여기에 표시됩니다."
            />
          )}
        </TabsContent>

        <TabsContent value="requests">
          {pendingRequests.length > 0 ? (
            <div className="friends-page__requests">
              {pendingRequests.map((request) => (
                <FriendRequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="친구 요청이 없습니다"
              description="새로운 친구 요청이 오면 여기에 표시됩니다."
            />
          )}
        </TabsContent>
      </Tabs>

      {/* 친구 추가 모달 */}
      <AddFriendModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
}
