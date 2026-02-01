'use client';

import Link from 'next/link';
import {
  Users,
  FileText,
  MessageSquare,
  Flag,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/common/user-avatar';
import './admin.css';

// Mock 데이터
const stats = [
  {
    title: '총 사용자',
    value: '12,489',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Users,
  },
  {
    title: '오늘 게시글',
    value: '234',
    change: '+8%',
    changeType: 'positive' as const,
    icon: FileText,
  },
  {
    title: '활성 채팅방',
    value: '1,892',
    change: '-3%',
    changeType: 'negative' as const,
    icon: MessageSquare,
  },
  {
    title: '대기 중 신고',
    value: '12',
    change: '+2',
    changeType: 'negative' as const,
    icon: Flag,
  },
];

const recentReports = [
  {
    id: '1',
    type: 'post',
    reason: '스팸',
    reporter: { nickname: '김철수', image: null },
    createdAt: '2분 전',
    status: 'pending',
  },
  {
    id: '2',
    type: 'comment',
    reason: '혐오 발언',
    reporter: { nickname: '이영희', image: null },
    createdAt: '15분 전',
    status: 'reviewing',
  },
  {
    id: '3',
    type: 'chat_message',
    reason: '괴롭힘',
    reporter: { nickname: '박민수', image: null },
    createdAt: '1시간 전',
    status: 'pending',
  },
];

const recentUsers = [
  {
    id: '1',
    nickname: '새싹개발자',
    email: 'newdev@example.com',
    createdAt: '오늘',
    status: 'active',
  },
  {
    id: '2',
    nickname: '코딩마스터',
    email: 'master@example.com',
    createdAt: '오늘',
    status: 'active',
  },
  {
    id: '3',
    nickname: '프론트천재',
    email: 'front@example.com',
    createdAt: '어제',
    status: 'active',
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

const statusLabels: Record<string, string> = {
  pending: '대기 중',
  reviewing: '검토 중',
  resolved: '처리 완료',
  rejected: '반려',
};

export default function AdminDashboardPage() {
  return (
    <div className="admin-dashboard">
      {/* 헤더 */}
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">관리자 대시보드</h1>
          <p className="admin-page__description">
            커뮤니티 현황을 한눈에 확인하세요
          </p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="admin-stats">
        {stats.map((stat) => (
          <div key={stat.title} className="admin-stat-card">
            <div className="admin-stat-card__header">
              <span className="admin-stat-card__title">{stat.title}</span>
              <div className="admin-stat-card__icon">
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="admin-stat-card__value">{stat.value}</div>
            <div className={`admin-stat-card__change admin-stat-card__change--${stat.changeType}`}>
              {stat.changeType === 'positive' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{stat.change} 이번 주</span>
            </div>
          </div>
        ))}
      </div>

      {/* 최근 신고 및 신규 사용자 */}
      <div className="admin-dashboard__grid">
        {/* 최근 신고 */}
        <div className="admin-dashboard__section">
          <div className="admin-dashboard__section-header">
            <h2 className="admin-dashboard__section-title">
              <Flag className="h-5 w-5" />
              최근 신고
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/reports">
                전체보기 <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="admin-dashboard__list">
            {recentReports.map((report) => (
              <div key={report.id} className="admin-dashboard__list-item">
                <div className="admin-dashboard__list-item-content">
                  <div className="admin-dashboard__list-item-main">
                    <span className="admin-dashboard__list-item-type">
                      {typeLabels[report.type]}
                    </span>
                    <span className="admin-dashboard__list-item-reason">
                      {report.reason}
                    </span>
                  </div>
                  <div className="admin-dashboard__list-item-meta">
                    <UserAvatar
                      src={report.reporter.image}
                      name={report.reporter.nickname}
                      size="xs"
                    />
                    <span>{report.reporter.nickname}</span>
                    <span>·</span>
                    <span>{report.createdAt}</span>
                  </div>
                </div>
                <span className={`admin-status-badge admin-status-badge--${report.status}`}>
                  {report.status === 'pending' && <Clock className="h-3 w-3" />}
                  {report.status === 'reviewing' && <Eye className="h-3 w-3" />}
                  {statusLabels[report.status]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 신규 사용자 */}
        <div className="admin-dashboard__section">
          <div className="admin-dashboard__section-header">
            <h2 className="admin-dashboard__section-title">
              <Users className="h-5 w-5" />
              신규 사용자
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/users">
                전체보기 <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="admin-dashboard__list">
            {recentUsers.map((user) => (
              <div key={user.id} className="admin-dashboard__list-item">
                <div className="admin-dashboard__list-item-user">
                  <UserAvatar name={user.nickname} size="sm" />
                  <div className="admin-dashboard__list-item-content">
                    <span className="admin-dashboard__list-item-name">
                      {user.nickname}
                    </span>
                    <span className="admin-dashboard__list-item-email">
                      {user.email}
                    </span>
                  </div>
                </div>
                <div className="admin-dashboard__list-item-right">
                  <span className="admin-dashboard__list-item-date">
                    {user.createdAt}
                  </span>
                  <span className={`admin-status-badge admin-status-badge--${user.status}`}>
                    <CheckCircle className="h-3 w-3" />
                    활성
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 빠른 작업 */}
      <div className="admin-dashboard__quick-actions">
        <h2 className="admin-dashboard__section-title">빠른 작업</h2>
        <div className="admin-dashboard__quick-actions-grid">
          <Link href="/admin/reports?status=pending" className="admin-quick-action">
            <div className="admin-quick-action__icon admin-quick-action__icon--warning">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="admin-quick-action__content">
              <span className="admin-quick-action__title">대기 중 신고 처리</span>
              <span className="admin-quick-action__count">12건</span>
            </div>
          </Link>
          <Link href="/admin/users?status=suspended" className="admin-quick-action">
            <div className="admin-quick-action__icon admin-quick-action__icon--danger">
              <Users className="h-5 w-5" />
            </div>
            <div className="admin-quick-action__content">
              <span className="admin-quick-action__title">정지 사용자 관리</span>
              <span className="admin-quick-action__count">3명</span>
            </div>
          </Link>
          <Link href="/admin/posts?flagged=true" className="admin-quick-action">
            <div className="admin-quick-action__icon admin-quick-action__icon--info">
              <FileText className="h-5 w-5" />
            </div>
            <div className="admin-quick-action__content">
              <span className="admin-quick-action__title">신고된 게시글</span>
              <span className="admin-quick-action__count">8건</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
