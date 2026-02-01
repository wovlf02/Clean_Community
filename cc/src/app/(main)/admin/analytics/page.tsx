'use client';

import {
  Users,
  FileText,
  MessageSquare,
  Flag,
  TrendingUp,
  Eye,
  Heart,
} from 'lucide-react';
import '../admin.css';
import './analytics.css';

// Mock 통계 데이터
const overviewStats = [
  { title: '총 사용자', value: '12,489', change: '+12%', icon: Users },
  { title: '총 게시글', value: '8,234', change: '+8%', icon: FileText },
  { title: '총 채팅방', value: '3,456', change: '+15%', icon: MessageSquare },
  { title: '처리된 신고', value: '156', change: '-23%', icon: Flag },
];

const weeklyActivity = [
  { day: '월', posts: 45, comments: 234, chats: 567 },
  { day: '화', posts: 52, comments: 289, chats: 612 },
  { day: '수', posts: 38, comments: 198, chats: 489 },
  { day: '목', posts: 61, comments: 312, chats: 723 },
  { day: '금', posts: 48, comments: 267, chats: 598 },
  { day: '토', posts: 35, comments: 178, chats: 412 },
  { day: '일', posts: 28, comments: 145, chats: 378 },
];

const topPosts = [
  { title: 'React 18의 새로운 기능들', views: 892, likes: 156 },
  { title: 'TypeScript 5.0 마이그레이션 가이드', views: 756, likes: 134 },
  { title: '개발자 취업 준비 꿀팁', views: 645, likes: 98 },
  { title: 'Next.js 14 App Router 정복하기', views: 534, likes: 87 },
  { title: '효율적인 코드 리뷰 방법', views: 423, likes: 76 },
];

const userGrowth = [
  { month: '9월', count: 8234 },
  { month: '10월', count: 9156 },
  { month: '11월', count: 10423 },
  { month: '12월', count: 11234 },
  { month: '1월', count: 12489 },
];

export default function AdminAnalyticsPage() {
  const maxPosts = Math.max(...weeklyActivity.map((d) => d.posts));
  const maxViews = Math.max(...topPosts.map((p) => p.views));
  const maxUsers = Math.max(...userGrowth.map((d) => d.count));

  return (
    <div className="admin-analytics">
      {/* 헤더 */}
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">통계</h1>
          <p className="admin-page__description">
            서비스 현황과 사용자 활동을 분석하세요
          </p>
        </div>
      </div>

      {/* 개요 통계 */}
      <div className="admin-stats">
        {overviewStats.map((stat) => (
          <div key={stat.title} className="admin-stat-card">
            <div className="admin-stat-card__header">
              <span className="admin-stat-card__title">{stat.title}</span>
              <div className="admin-stat-card__icon">
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="admin-stat-card__value">{stat.value}</div>
            <div className={`admin-stat-card__change admin-stat-card__change--${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
              <TrendingUp className="h-3 w-3" />
              <span>{stat.change} 지난달 대비</span>
            </div>
          </div>
        ))}
      </div>

      {/* 차트 섹션 */}
      <div className="analytics-charts">
        {/* 주간 활동 */}
        <div className="analytics-chart">
          <h3 className="analytics-chart__title">주간 활동</h3>
          <div className="analytics-bar-chart">
            {weeklyActivity.map((data) => (
              <div key={data.day} className="analytics-bar-chart__item">
                <div className="analytics-bar-chart__bars">
                  <div
                    className="analytics-bar-chart__bar analytics-bar-chart__bar--posts"
                    style={{ height: `${(data.posts / maxPosts) * 100}%` }}
                    title={`게시글: ${data.posts}`}
                  />
                </div>
                <span className="analytics-bar-chart__label">{data.day}</span>
              </div>
            ))}
          </div>
          <div className="analytics-chart__legend">
            <div className="analytics-chart__legend-item">
              <div className="analytics-chart__legend-color analytics-chart__legend-color--posts" />
              <span>게시글</span>
            </div>
          </div>
        </div>

        {/* 사용자 증가 추이 */}
        <div className="analytics-chart">
          <h3 className="analytics-chart__title">사용자 증가 추이</h3>
          <div className="analytics-line-chart">
            {userGrowth.map((data) => (
              <div key={data.month} className="analytics-line-chart__item">
                <div
                  className="analytics-line-chart__point"
                  style={{ bottom: `${(data.count / maxUsers) * 80}%` }}
                >
                  <span className="analytics-line-chart__value">{data.count.toLocaleString()}</span>
                </div>
                <span className="analytics-line-chart__label">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 인기 게시글 */}
      <div className="analytics-section">
        <h3 className="analytics-section__title">인기 게시글 TOP 5</h3>
        <div className="analytics-top-posts">
          {topPosts.map((post, index) => (
            <div key={post.title} className="analytics-top-post">
              <span className="analytics-top-post__rank">{index + 1}</span>
              <div className="analytics-top-post__content">
                <span className="analytics-top-post__title">{post.title}</span>
                <div className="analytics-top-post__stats">
                  <span>
                    <Eye className="h-3 w-3" />
                    {post.views}
                  </span>
                  <span>
                    <Heart className="h-3 w-3" />
                    {post.likes}
                  </span>
                </div>
              </div>
              <div className="analytics-top-post__bar-wrapper">
                <div
                  className="analytics-top-post__bar"
                  style={{ width: `${(post.views / maxViews) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
