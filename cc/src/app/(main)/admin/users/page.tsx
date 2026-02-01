'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Ban,
  Shield,
  Mail,
  Calendar,
  UserX,
  UserCheck,
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { showToast } from '@/lib/toast';
import '../admin.css';
import './users.css';

// Mock 사용자 데이터
const mockUsers = [
  {
    id: '1',
    nickname: '김철수',
    email: 'kim@example.com',
    role: 'user',
    status: 'active',
    postsCount: 42,
    commentsCount: 156,
    reportsReceived: 0,
    createdAt: '2025-06-15T10:00:00Z',
    lastLoginAt: '2026-02-01T09:30:00Z',
  },
  {
    id: '2',
    nickname: '이영희',
    email: 'lee@example.com',
    role: 'user',
    status: 'active',
    postsCount: 28,
    commentsCount: 89,
    reportsReceived: 1,
    createdAt: '2025-07-20T14:00:00Z',
    lastLoginAt: '2026-02-01T08:15:00Z',
  },
  {
    id: '3',
    nickname: '악성유저',
    email: 'bad@example.com',
    role: 'user',
    status: 'suspended',
    postsCount: 5,
    commentsCount: 12,
    reportsReceived: 8,
    createdAt: '2025-12-01T09:00:00Z',
    lastLoginAt: '2026-01-15T11:00:00Z',
  },
  {
    id: '4',
    nickname: '관리자',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    postsCount: 15,
    commentsCount: 45,
    reportsReceived: 0,
    createdAt: '2025-01-01T00:00:00Z',
    lastLoginAt: '2026-02-01T10:00:00Z',
  },
  {
    id: '5',
    nickname: '박민수',
    email: 'park@example.com',
    role: 'user',
    status: 'active',
    postsCount: 67,
    commentsCount: 234,
    reportsReceived: 2,
    createdAt: '2025-05-10T16:00:00Z',
    lastLoginAt: '2026-01-31T22:00:00Z',
  },
];

const roleLabels: Record<string, string> = {
  admin: '관리자',
  moderator: '운영자',
  user: '일반',
};

const statusLabels: Record<string, string> = {
  active: '활성',
  suspended: '정지',
  banned: '영구정지',
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.nickname.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, search, statusFilter, roleFilter]);

  const handleViewUser = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleSuspendUser = () => {
    if (!selectedUser) return;

    const newStatus = selectedUser.status === 'suspended' ? 'active' : 'suspended';
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? { ...u, status: newStatus } : u))
    );

    showToast.success(
      newStatus === 'suspended' ? '계정 정지' : '정지 해제',
      newStatus === 'suspended'
        ? `${selectedUser.nickname} 계정이 정지되었습니다.`
        : `${selectedUser.nickname} 계정이 활성화되었습니다.`
    );
    setShowSuspendDialog(false);
    setShowUserModal(false);
  };

  const handlePromoteToAdmin = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: 'admin' } : u))
    );
    showToast.success('권한 변경', '관리자 권한이 부여되었습니다.');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const activeCount = users.filter((u) => u.status === 'active').length;
  const suspendedCount = users.filter((u) => u.status === 'suspended').length;

  return (
    <div className="admin-users">
      {/* 헤더 */}
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">사용자 관리</h1>
          <p className="admin-page__description">
            사용자 계정을 관리하고 권한을 설정하세요
          </p>
        </div>
        <div className="admin-users__summary">
          <div className="admin-users__summary-item admin-users__summary-item--success">
            <UserCheck className="h-4 w-4" />
            <span>활성: {activeCount}명</span>
          </div>
          <div className="admin-users__summary-item admin-users__summary-item--danger">
            <UserX className="h-4 w-4" />
            <span>정지: {suspendedCount}명</span>
          </div>
        </div>
      </div>

      {/* 필터 */}
      <div className="admin-filters">
        <Input
          className="admin-search"
          placeholder="닉네임, 이메일 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="admin-filter-btn">
              <Filter className="h-4 w-4 mr-2" />
              상태: {statusFilter === 'all' ? '전체' : statusLabels[statusFilter]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>
              전체
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter('active')}>
              활성
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('suspended')}>
              정지
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="admin-filter-btn">
              <Filter className="h-4 w-4 mr-2" />
              권한: {roleFilter === 'all' ? '전체' : roleLabels[roleFilter]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setRoleFilter('all')}>
              전체
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setRoleFilter('admin')}>
              관리자
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter('user')}>
              일반
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 테이블 */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>사용자</th>
              <th>이메일</th>
              <th>권한</th>
              <th>게시글</th>
              <th>댓글</th>
              <th>피신고</th>
              <th>상태</th>
              <th>가입일</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="admin-users__user">
                    <UserAvatar name={user.nickname} size="sm" />
                    <span className="admin-users__nickname">{user.nickname}</span>
                  </div>
                </td>
                <td>
                  <span className="admin-users__email">{user.email}</span>
                </td>
                <td>
                  <span className={`admin-users__role admin-users__role--${user.role}`}>
                    {user.role === 'admin' && <Shield className="h-3 w-3" />}
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td>{user.postsCount}</td>
                <td>{user.commentsCount}</td>
                <td>
                  <span className={user.reportsReceived > 0 ? 'text-red-500' : ''}>
                    {user.reportsReceived}
                  </span>
                </td>
                <td>
                  <span className={`admin-status-badge admin-status-badge--${user.status}`}>
                    {statusLabels[user.status]}
                  </span>
                </td>
                <td>
                  <span className="admin-users__date">{formatDate(user.createdAt)}</span>
                </td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewUser(user)}>
                        상세 보기
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.role !== 'admin' && (
                        <DropdownMenuItem onClick={() => handlePromoteToAdmin(user.id)}>
                          <Shield className="mr-2 h-4 w-4" />
                          관리자 권한 부여
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          setShowSuspendDialog(true);
                        }}
                        className={user.status === 'suspended' ? 'text-green-600' : 'text-red-600'}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        {user.status === 'suspended' ? '정지 해제' : '계정 정지'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="admin-table__empty">
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
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

      {/* 사용자 상세 모달 */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="admin-user-detail-modal">
          <DialogHeader>
            <DialogTitle>사용자 상세 정보</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="admin-user-detail">
              <div className="admin-user-detail__header">
                <UserAvatar name={selectedUser.nickname} size="lg" />
                <div className="admin-user-detail__info">
                  <h3>{selectedUser.nickname}</h3>
                  <div className="admin-user-detail__badges">
                    <span className={`admin-users__role admin-users__role--${selectedUser.role}`}>
                      {selectedUser.role === 'admin' && <Shield className="h-3 w-3" />}
                      {roleLabels[selectedUser.role]}
                    </span>
                    <span className={`admin-status-badge admin-status-badge--${selectedUser.status}`}>
                      {statusLabels[selectedUser.status]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="admin-user-detail__grid">
                <div className="admin-user-detail__item">
                  <Mail className="h-4 w-4" />
                  <span>{selectedUser.email}</span>
                </div>
                <div className="admin-user-detail__item">
                  <Calendar className="h-4 w-4" />
                  <span>가입일: {formatDate(selectedUser.createdAt)}</span>
                </div>
              </div>

              <div className="admin-user-detail__stats">
                <div className="admin-user-detail__stat">
                  <span className="admin-user-detail__stat-value">{selectedUser.postsCount}</span>
                  <span className="admin-user-detail__stat-label">게시글</span>
                </div>
                <div className="admin-user-detail__stat">
                  <span className="admin-user-detail__stat-value">{selectedUser.commentsCount}</span>
                  <span className="admin-user-detail__stat-label">댓글</span>
                </div>
                <div className="admin-user-detail__stat">
                  <span className="admin-user-detail__stat-value admin-user-detail__stat-value--warning">
                    {selectedUser.reportsReceived}
                  </span>
                  <span className="admin-user-detail__stat-label">피신고</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserModal(false)}>
              닫기
            </Button>
            {selectedUser && selectedUser.role !== 'admin' && (
              <Button
                variant={selectedUser.status === 'suspended' ? 'default' : 'destructive'}
                onClick={() => setShowSuspendDialog(true)}
              >
                <Ban className="mr-2 h-4 w-4" />
                {selectedUser.status === 'suspended' ? '정지 해제' : '계정 정지'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 정지 확인 다이얼로그 */}
      <ConfirmDialog
        open={showSuspendDialog}
        onOpenChange={setShowSuspendDialog}
        title={selectedUser?.status === 'suspended' ? '정지 해제' : '계정 정지'}
        description={
          selectedUser?.status === 'suspended'
            ? `${selectedUser?.nickname} 계정의 정지를 해제하시겠습니까?`
            : `${selectedUser?.nickname} 계정을 정지하시겠습니까? 정지된 사용자는 로그인이 제한됩니다.`
        }
        confirmText={selectedUser?.status === 'suspended' ? '해제' : '정지'}
        variant={selectedUser?.status === 'suspended' ? 'default' : 'destructive'}
        onConfirm={handleSuspendUser}
      />
    </div>
  );
}
