'use client';

import Link from 'next/link';
import { Users, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/common/user-avatar';
import { OnlineIndicator } from '@/components/common/online-indicator';
import './online-friends.css';

const onlineFriends = [
  { id: '1', name: '김철수', avatar: null, isOnline: true, activity: '게시글 작성 중' },
  { id: '2', name: '이영희', avatar: null, isOnline: true, activity: '채팅 중' },
  { id: '3', name: '박지민', avatar: null, isOnline: false, activity: '5분 전 활동' },
  { id: '4', name: '최수현', avatar: null, isOnline: true, activity: '게시판 탐색 중' },
  { id: '5', name: '정민호', avatar: null, isOnline: true, activity: '방금 접속' },
];

export function OnlineFriends() {
  const onlineCount = onlineFriends.filter(f => f.isOnline).length;

  return (
    <Card className="online-friends">
      <CardHeader className="online-friends__header">
        <CardTitle className="online-friends__title">
          <Users className="h-5 w-5" />
          온라인 친구
          <span className="online-friends__count">{onlineCount}</span>
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/friends">전체보기</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="online-friends__list">
          {onlineFriends.map((friend) => (
            <div key={friend.id} className="online-friends__item">
              <OnlineIndicator
                isOnline={friend.isOnline}
                size="sm"
                className="online-friends__avatar-wrapper"
              >
                <UserAvatar
                  name={friend.name}
                  src={friend.avatar}
                  size="md"
                />
              </OnlineIndicator>
              <div className="online-friends__info">
                <span className="online-friends__name">{friend.name}</span>
                <span className="online-friends__activity">{friend.activity}</span>
              </div>
              <Button variant="ghost" size="icon" className="online-friends__action" asChild>
                <Link href={`/chat/${friend.id}`}>
                  <MessageCircle className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
