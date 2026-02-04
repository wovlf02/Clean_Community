'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, UserPlus, Users, UserCheck, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    const existingRoom = chatRooms.find(
      (room) =>
        room.type === 'direct' &&
        room.participants.some((p) => p.id === friendId)
    );

    if (existingRoom) {
      router.push(`/chat?roomId=${existingRoom.id}`);
    } else {
      showToast.success('채팅방 생성', `${friendNickname}님과의 채팅방을 생성했습니다.`);
      router.push('/chat?roomId=room-1');
    }
  };

  return (
    <div className="friends-page">
      {/* 헤더 섹션 */}
      <div className="friends-page__header">
        <div className="friends-page__header-content">
          <div className="friends-page__header-icon">
            <Users className="h-6 w-6" />
          </div>
          <div className="friends-page__header-text">
            <h1 className="friends-page__title">친구</h1>
            <p className="friends-page__subtitle">
              {friends.length}명의 친구 · {onlineFriends.length}명 온라인
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="friends-page__add-btn"
          size="icon"
          title="친구 추가"
        >
          <UserPlus className="h-5 w-5" />
        </Button>
      </div>

      {/* 검색 섹션 */}
      <div className="friends-page__search-section">
        <div className="friends-page__search-wrapper">
          <Search className="friends-page__search-icon" />
          <input
            type="text"
            placeholder="친구 이름으로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="friends-page__search-input"
          />
          {search && (
            <button
              className="friends-page__search-clear"
              onClick={() => setSearch('')}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="friends-page__tabs">
        <TabsList className="friends-page__tab-list">
          <TabsTrigger value="all" className="friends-page__tab">
            <Users className="h-4 w-4" />
            <span>전체</span>
            <span className="friends-page__tab-count">{filteredFriends.length}</span>
          </TabsTrigger>
          <TabsTrigger value="online" className="friends-page__tab">
            <UserCheck className="h-4 w-4" />
            <span>온라인</span>
            <span className="friends-page__tab-count friends-page__tab-count--online">{onlineFriends.length}</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="friends-page__tab">
            <Clock className="h-4 w-4" />
            <span>요청</span>
            {pendingRequests.length > 0 && (
              <span className="friends-page__tab-count friends-page__tab-count--requests">{pendingRequests.length}</span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="friends-page__content">
          {filteredFriends.length > 0 ? (
            <div className="friends-page__grid">
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
              icon={Sparkles}
              title="친구가 없습니다"
              description="새로운 친구를 추가하고 함께 소통해보세요!"
              action={{
                label: '친구 추가하기',
                onClick: () => setShowAddModal(true),
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="online" className="friends-page__content">
          {onlineFriends.length > 0 ? (
            <div className="friends-page__grid">
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
              icon={UserCheck}
              title="온라인 친구가 없습니다"
              description="친구들이 접속하면 여기에 표시됩니다."
            />
          )}
        </TabsContent>

        <TabsContent value="requests" className="friends-page__content">
          {pendingRequests.length > 0 ? (
            <div className="friends-page__requests">
              {pendingRequests.map((request) => (
                <FriendRequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Clock}
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
