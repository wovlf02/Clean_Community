'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  FileText,
  User,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserAvatar } from '@/components/common/user-avatar';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { showToast } from '@/lib/toast';
import '../admin.css';
import './reports.css';

// Mock 신고 데이터
const mockReports = [
  {
    id: '1',
    targetType: 'post',
    targetId: 'post-1',
    targetPreview: '오늘 날씨가 정말 좋네요! 다들 좋은 하루 보내세요...',
    reason: 'spam',
    reasonLabel: '스팸',
    description: '광고성 게시글입니다.',
    reporter: { id: 'user-1', nickname: '김철수', image: null },
    reportedUser: { id: 'user-2', nickname: '스팸봇', image: null },
    status: 'pending',
    createdAt: '2026-02-01T10:30:00Z',
  },
  {
    id: '2',
    targetType: 'comment',
    targetId: 'comment-1',
    targetPreview: '이건 정말 최악의 의견이에요...',
    reason: 'harassment',
    reasonLabel: '괴롭힘',
    description: '특정 사용자를 공격하는 댓글입니다.',
    reporter: { id: 'user-3', nickname: '이영희', image: null },
    reportedUser: { id: 'user-4', nickname: '트롤러', image: null },
    status: 'reviewing',
    createdAt: '2026-02-01T09:15:00Z',
  },
  {
    id: '3',
    targetType: 'chat_message',
    targetId: 'msg-1',
    targetPreview: '너 진짜 짜증나...',
    reason: 'hate_speech',
    reasonLabel: '혐오 발언',
    description: null,
    reporter: { id: 'user-5', nickname: '박민수', image: null },
    reportedUser: { id: 'user-6', nickname: '악성유저', image: null },
    status: 'pending',
    createdAt: '2026-02-01T08:00:00Z',
  },
  {
    id: '4',
    targetType: 'post',
    targetId: 'post-2',
    targetPreview: '이 제품 정말 추천해요! 링크: ...',
    reason: 'spam',
    reasonLabel: '스팸',
    description: '무단 광고 게시글',
    reporter: { id: 'user-7', nickname: '정다은', image: null },
    reportedUser: { id: 'user-8', nickname: '광고계정', image: null },
    status: 'resolved',
    createdAt: '2026-01-31T15:30:00Z',
  },
  {
    id: '5',
    targetType: 'user',
    targetId: 'user-9',
    targetPreview: '사용자 프로필',
    reason: 'impersonation',
    reasonLabel: '사칭',
    description: '유명인을 사칭하고 있습니다.',
    reporter: { id: 'user-10', nickname: '최지훈', image: null },
    reportedUser: { id: 'user-9', nickname: '가짜유명인', image: null },
    status: 'rejected',
    createdAt: '2026-01-30T12:00:00Z',
  },
];

const typeLabels: Record<string, string> = {
  post: '게시글',
  comment: '댓글',
  reply: '답글',
  chat_room: '채팅방',
  chat_message: '메시지',
  user: '사용자',
};

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  post: FileText,
  comment: MessageSquare,
  reply: MessageSquare,
  chat_room: MessageSquare,
  chat_message: MessageSquare,
  user: User,
};

const statusLabels: Record<string, string> = {
  pending: '대기 중',
  reviewing: '검토 중',
  resolved: '처리 완료',
  rejected: '반려',
};

export default function AdminReportsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [reports, setReports] = useState(mockReports);
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.targetPreview.toLowerCase().includes(search.toLowerCase()) ||
        report.reporter.nickname.toLowerCase().includes(search.toLowerCase()) ||
        report.reportedUser.nickname.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      const matchesType = typeFilter === 'all' || report.targetType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [reports, search, statusFilter, typeFilter]);

  const handleViewDetail = (report: typeof mockReports[0]) => {
    setSelectedReport(report);
    setShowDetailModal(true);
    setAdminNote('');
  };

  const handleUpdateStatus = (reportId: string, newStatus: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
    );

    const statusLabel = statusLabels[newStatus];
    showToast.success('상태 변경', `신고가 "${statusLabel}" 상태로 변경되었습니다.`);
    setShowDetailModal(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const reviewingCount = reports.filter((r) => r.status === 'reviewing').length;

  return (
    <div className="admin-reports">
      {/* 헤더 */}
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">신고 관리</h1>
          <p className="admin-page__description">
            사용자 신고를 검토하고 적절한 조치를 취하세요
          </p>
        </div>
        <div className="admin-reports__summary">
          <div className="admin-reports__summary-item admin-reports__summary-item--warning">
            <Clock className="h-4 w-4" />
            <span>대기 중: {pendingCount}건</span>
          </div>
          <div className="admin-reports__summary-item admin-reports__summary-item--info">
            <Eye className="h-4 w-4" />
            <span>검토 중: {reviewingCount}건</span>
          </div>
        </div>
      </div>

      {/* 필터 */}
      <div className="admin-filters">
        <Input
          className="admin-search"
          placeholder="신고 내용, 신고자, 피신고자 검색..."
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
            <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
              대기 중
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('reviewing')}>
              검토 중
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('resolved')}>
              처리 완료
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>
              반려
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="admin-filter-btn">
              <Filter className="h-4 w-4 mr-2" />
              유형: {typeFilter === 'all' ? '전체' : typeLabels[typeFilter]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setTypeFilter('all')}>
              전체
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTypeFilter('post')}>
              게시글
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('comment')}>
              댓글
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('chat_message')}>
              메시지
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('user')}>
              사용자
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 테이블 */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>유형</th>
              <th>신고 내용</th>
              <th>신고 사유</th>
              <th>신고자</th>
              <th>피신고자</th>
              <th>상태</th>
              <th>신고일시</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => {
              const TypeIcon = typeIcons[report.targetType] || FileText;

              return (
                <tr key={report.id}>
                  <td>
                    <div className="admin-reports__type">
                      <TypeIcon className="h-4 w-4" />
                      {typeLabels[report.targetType]}
                    </div>
                  </td>
                  <td>
                    <p className="admin-reports__preview">{report.targetPreview}</p>
                  </td>
                  <td>
                    <span className="admin-reports__reason">{report.reasonLabel}</span>
                  </td>
                  <td>
                    <div className="admin-reports__user">
                      <UserAvatar
                        src={report.reporter.image}
                        name={report.reporter.nickname}
                        size="xs"
                      />
                      {report.reporter.nickname}
                    </div>
                  </td>
                  <td>
                    <div className="admin-reports__user">
                      <UserAvatar
                        src={report.reportedUser.image}
                        name={report.reportedUser.nickname}
                        size="xs"
                      />
                      {report.reportedUser.nickname}
                    </div>
                  </td>
                  <td>
                    <span className={`admin-status-badge admin-status-badge--${report.status}`}>
                      {statusLabels[report.status]}
                    </span>
                  </td>
                  <td>
                    <span className="admin-reports__date">{formatDate(report.createdAt)}</span>
                  </td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetail(report)}>
                          <Eye className="mr-2 h-4 w-4" />
                          상세 보기
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(report.id, 'resolved')}
                          className="text-green-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          처리 완료
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(report.id, 'rejected')}
                          className="text-red-600"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          반려
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredReports.length === 0 && (
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

      {/* 상세 보기 모달 */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="admin-report-detail-modal">
          <DialogHeader>
            <DialogTitle>신고 상세 정보</DialogTitle>
            <DialogDescription>
              신고 내용을 확인하고 적절한 조치를 취하세요.
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="admin-report-detail">
              <div className="admin-report-detail__section">
                <h4>신고 대상</h4>
                <div className="admin-report-detail__target">
                  <span className="admin-report-detail__type">
                    {typeLabels[selectedReport.targetType]}
                  </span>
                  <p className="admin-report-detail__preview">
                    {selectedReport.targetPreview}
                  </p>
                </div>
              </div>

              <div className="admin-report-detail__section">
                <h4>신고 사유</h4>
                <p>{selectedReport.reasonLabel}</p>
                {selectedReport.description && (
                  <p className="admin-report-detail__description">
                    "{selectedReport.description}"
                  </p>
                )}
              </div>

              <div className="admin-report-detail__grid">
                <div className="admin-report-detail__section">
                  <h4>신고자</h4>
                  <div className="admin-report-detail__user">
                    <UserAvatar
                      src={selectedReport.reporter.image}
                      name={selectedReport.reporter.nickname}
                      size="sm"
                    />
                    <span>{selectedReport.reporter.nickname}</span>
                  </div>
                </div>
                <div className="admin-report-detail__section">
                  <h4>피신고자</h4>
                  <div className="admin-report-detail__user">
                    <UserAvatar
                      src={selectedReport.reportedUser.image}
                      name={selectedReport.reportedUser.nickname}
                      size="sm"
                    />
                    <span>{selectedReport.reportedUser.nickname}</span>
                  </div>
                </div>
              </div>

              <div className="admin-report-detail__section">
                <h4>관리자 메모</h4>
                <Textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="처리 내용이나 메모를 입력하세요..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="admin-report-detail__footer">
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              닫기
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedReport && handleUpdateStatus(selectedReport.id, 'rejected')}
            >
              <XCircle className="mr-2 h-4 w-4" />
              반려
            </Button>
            <Button
              onClick={() => selectedReport && handleUpdateStatus(selectedReport.id, 'resolved')}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              처리 완료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
