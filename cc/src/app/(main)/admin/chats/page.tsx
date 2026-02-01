'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash,
  Users,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserAvatar } from '@/components/common/user-avatar';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { showToast } from '@/lib/toast';
import '../admin.css';

// Mock 채팅방 데이터
const mockChatRooms = [
  {
    id: '1',
    name: null,
    type: 'direct',
    participants: [
      { id: 'user-1', nickname: '김철수' },
      { id: 'user-2', nickname: '이영희' },
    ],
    messageCount: 156,
    reportsCount: 0,
    lastMessageAt: '2026-02-01T10:30:00Z',
    createdAt: '2025-10-15T14:00:00Z',
  },
  {
    id: '2',
    name: '스터디 그룹',
    type: 'group',
    participants: [
      { id: 'user-1', nickname: '김철수' },
      { id: 'user-2', nickname: '이영희' },
      { id: 'user-3', nickname: '박민수' },
      { id: 'user-4', nickname: '정다은' },
    ],
    messageCount: 892,
    reportsCount: 2,
    lastMessageAt: '2026-02-01T09:15:00Z',
    createdAt: '2025-08-20T10:00:00Z',
  },
  {
    id: '3',
    name: '프로젝트 팀',
    type: 'group',
    participants: [
      { id: 'user-5', nickname: '최지훈' },
      { id: 'user-6', nickname: '강수진' },
      { id: 'user-7', nickname: '윤성호' },
    ],
    messageCount: 445,
    reportsCount: 0,
    lastMessageAt: '2026-01-31T22:00:00Z',
    createdAt: '2025-11-05T16:00:00Z',
  },
];

const typeLabels: Record<string, string> = {
  direct: '1:1',
  group: '그룹',
};

export default function AdminChatsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [chatRooms, setChatRooms] = useState(mockChatRooms);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const filteredRooms = useMemo(() => {
    return chatRooms.filter((room) => {
      const displayName = room.name || room.participants.map(p => p.nickname).join(', ');
      const matchesSearch = displayName.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || room.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [chatRooms, search, typeFilter]);

  const handleDelete = () => {
    if (!selectedChatId) return;
    setChatRooms((prev) => prev.filter((r) => r.id !== selectedChatId));
    showToast.success('삭제 완료', '채팅방이 삭제되었습니다.');
    setShowDeleteDialog(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="admin-chats">
      {/* 헤더 */}
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">채팅 관리</h1>
          <p className="admin-page__description">
            채팅방을 관리하고 신고된 메시지를 확인하세요
          </p>
        </div>
      </div>

      {/* 필터 */}
      <div className="admin-filters">
        <Input
          className="admin-search"
          placeholder="채팅방 이름, 참여자 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              유형: {typeFilter === 'all' ? '전체' : typeLabels[typeFilter]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setTypeFilter('all')}>
              전체
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTypeFilter('direct')}>
              1:1 채팅
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('group')}>
              그룹 채팅
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 테이블 */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>채팅방</th>
              <th>유형</th>
              <th>참여자</th>
              <th>메시지 수</th>
              <th>신고</th>
              <th>마지막 메시지</th>
              <th>생성일</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map((room) => {
              const displayName = room.name || room.participants.map(p => p.nickname).join(', ');

              return (
                <tr key={room.id}>
                  <td>
                    <div className="admin-chats__room">
                      {room.type === 'group' ? (
                        <div className="admin-chats__avatars">
                          {room.participants.slice(0, 2).map((p) => (
                            <UserAvatar key={p.id} name={p.nickname} size="xs" />
                          ))}
                        </div>
                      ) : (
                        <UserAvatar name={room.participants[0].nickname} size="sm" />
                      )}
                      <span className="admin-chats__name">{displayName}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-chats__type admin-chats__type--${room.type}`}>
                      {typeLabels[room.type]}
                    </span>
                  </td>
                  <td>
                    <div className="admin-chats__stat">
                      <Users className="h-3 w-3" />
                      {room.participants.length}
                    </div>
                  </td>
                  <td>
                    <div className="admin-chats__stat">
                      <MessageCircle className="h-3 w-3" />
                      {room.messageCount}
                    </div>
                  </td>
                  <td>
                    <span className={room.reportsCount > 0 ? 'text-red-500 font-semibold' : ''}>
                      {room.reportsCount}
                    </span>
                  </td>
                  <td>{formatDate(room.lastMessageAt)}</td>
                  <td>{formatDate(room.createdAt)}</td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          메시지 보기
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedChatId(room.id);
                            setShowDeleteDialog(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="admin-pagination">
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="h-4 w-4 mr-1" />
          이전
        </Button>
        <span className="admin-pagination__info">1 / 1 페이지</span>
        <Button variant="outline" size="sm" disabled>
          다음
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* 삭제 확인 */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="채팅방 삭제"
        description="정말 이 채팅방을 삭제하시겠습니까? 모든 메시지가 삭제되며 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
