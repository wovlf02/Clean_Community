'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  MessageCircle,
  Users,
  TrendingUp,
  ArrowRight,
  Calendar,
  Heart,
  Eye,
  MessageSquare,
  Award,
  Target,
  Zap,
  BarChart3,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/common/user-avatar';
import { currentUser } from '@/mocks/users';
import '../dashboard.css';

// 통계 데이터
const stats = [
  {
    label: '내 게시글',
    value: 12,
    icon: FileText,
    color: 'hsl(280, 55%, 55%)',
    href: '/board',
    change: '+3',
    changeType: 'increase' as const,
    description: '이번 주에 3개의 게시글을 작성했습니다'
  },
  {
    label: '받은 좋아요',
    value: 48,
    icon: Heart,
    color: 'hsl(350, 55%, 55%)',
    href: '/board',
    change: '+12',
    changeType: 'increase' as const,
    description: '지난 주 대비 25% 증가했습니다'
  },
  {
    label: '안 읽은 채팅',
    value: 3,
    icon: MessageCircle,
    color: 'hsl(200, 60%, 50%)',
    href: '/chat',
    change: '+2',
    changeType: 'increase' as const,
    description: '2개의 새로운 메시지가 있습니다'
  },
  {
    label: '친구',
    value: 8,
    icon: Users,
    color: 'hsl(160, 55%, 45%)',
    href: '/friends',
    change: '+1',
    changeType: 'increase' as const,
    description: '이번 주에 새로운 친구가 생겼습니다'
  },
  {
    label: '작성한 댓글',
    value: 34,
    icon: MessageSquare,
    color: 'hsl(45, 70%, 55%)',
    href: '/board',
    change: '+8',
    changeType: 'increase' as const,
    description: '이번 주에 8개의 댓글을 작성했습니다'
  },
  {
    label: '게시글 조회수',
    value: 256,
    icon: Eye,
    color: 'hsl(220, 60%, 55%)',
    href: '/board',
    change: '+45',
    changeType: 'increase' as const,
    description: '지난 주 대비 조회수가 증가했습니다'
  },
];

// 최근 활동
const recentActivities = [
  {
    type: 'post',
    content: '새 게시글을 작성했습니다',
    detail: '"TypeScript 베스트 프랙티스"',
    time: '2시간 전',
    user: '나',
    icon: FileText,
    color: 'hsl(280, 55%, 55%)'
  },
  {
    type: 'like',
    content: '홍길동님이 좋아요를 눌렀습니다',
    detail: '"Next.js 14 업데이트 정리"',
    time: '3시간 전',
    user: '홍길동',
    icon: Heart,
    color: 'hsl(350, 55%, 55%)'
  },
  {
    type: 'comment',
    content: '새 댓글이 달렸습니다',
    detail: '"좋은 글 감사합니다!"',
    time: '5시간 전',
    user: '이서연',
    icon: MessageSquare,
    color: 'hsl(200, 60%, 50%)'
  },
  {
    type: 'friend',
    content: '이서연님과 친구가 되었습니다',
    detail: '프로필을 확인해보세요',
    time: '1일 전',
    user: '이서연',
    icon: Users,
    color: 'hsl(160, 55%, 45%)'
  },
  {
    type: 'like',
    content: '김철수님이 좋아요를 눌렀습니다',
    detail: '"주말 나들이 추천 장소"',
    time: '1일 전',
    user: '김철수',
    icon: Heart,
    color: 'hsl(350, 55%, 55%)'
  },
  {
    type: 'achievement',
    content: '게시글이 100회 조회되었습니다',
    detail: '축하합니다!',
    time: '2일 전',
    user: '시스템',
    icon: Award,
    color: 'hsl(45, 70%, 55%)'
  },
];

// 인기 게시글
const popularPosts = [
  {
    id: '1',
    title: '오늘 날씨가 정말 좋네요!',
    views: 128,
    likes: 24,
    comments: 8,
    trend: 'up' as const,
    author: {
      name: '홍길동',
      image: null
    }
  },
  {
    id: '2',
    title: 'Next.js 14 업데이트 정리',
    views: 256,
    likes: 42,
    comments: 15,
    trend: 'up' as const,
    author: {
      name: '이서연',
      image: null
    }
  },
  {
    id: '3',
    title: '주말 나들이 추천 장소',
    views: 89,
    likes: 15,
    comments: 6,
    trend: 'stable' as const,
    author: {
      name: '김철수',
      image: null
    }
  },
  {
    id: '4',
    title: 'TypeScript 베스트 프랙티스',
    views: 178,
    likes: 31,
    comments: 12,
    trend: 'up' as const,
    author: {
      name: '박민지',
      image: null
    }
  },
];

// 주간 활동 데이터
const weeklyActivity = [
  { day: '월', posts: 2, comments: 5, likes: 8 },
  { day: '화', posts: 1, comments: 3, likes: 6 },
  { day: '수', posts: 3, comments: 7, likes: 12 },
  { day: '목', posts: 2, comments: 4, likes: 9 },
  { day: '금', posts: 4, comments: 8, likes: 15 },
  { day: '토', posts: 1, comments: 2, likes: 5 },
  { day: '일', posts: 0, comments: 5, likes: 3 },
];

// 목표 달성률
const goals = [
  {
    label: '이번 주 목표',
    current: 15,
    target: 20,
    icon: Target,
    color: 'hsl(280, 55%, 55%)',
    description: '게시글 및 댓글 작성'
  },
  {
    label: '활동 연속일',
    current: 7,
    target: 30,
    icon: Zap,
    color: 'hsl(45, 70%, 55%)',
    description: '30일 연속 활동 도전'
  },
  {
    label: '친구 목표',
    current: 8,
    target: 10,
    icon: Users,
    color: 'hsl(160, 55%, 45%)',
    description: '10명의 친구 만들기'
  },
];

export default function DashboardPage() {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredActivity, setHoveredActivity] = useState<number | null>(null);

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div className="dashboard">
      {/* 환영 메시지 */}
      <div className="dashboard__welcome">
        <div className="dashboard__welcome-content">
          <h1 className="dashboard__welcome-title">
            안녕하세요, {currentUser.nickname}님! 👋
          </h1>
          <p className="dashboard__welcome-subtitle">
            오늘도 <strong>감성 커뮤니티</strong>에서 즐거운 하루 보내세요
          </p>
        </div>
        <div className="dashboard__welcome-date">
          <Calendar className="h-4 w-4" />
          <span>{today}</span>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="dashboard__stats">
        {stats.map((stat, index) => (
          <Link key={stat.label} href={stat.href}>
            <Card
              className="dashboard__stat-card"
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <CardContent className="dashboard__stat-content">
                <div
                  className="dashboard__stat-icon"
                  style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="dashboard__stat-info">
                  <div className="dashboard__stat-top">
                    <span className="dashboard__stat-value">{stat.value}</span>
                    <span className={`dashboard__stat-change dashboard__stat-change--${stat.changeType}`}>
                      {stat.change}
                    </span>
                  </div>
                  <span className="dashboard__stat-label">{stat.label}</span>
                  {hoveredStat === index && (
                    <span className="dashboard__stat-description">
                      {stat.description}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* 목표 달성률 */}
      <div className="dashboard__goals">
        {goals.map((goal) => {
          const percentage = (goal.current / goal.target) * 100;
          return (
            <Card key={goal.label} className="dashboard__goal-card">
              <CardContent className="dashboard__goal-content">
                <div
                  className="dashboard__goal-icon"
                  style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
                >
                  <goal.icon className="h-5 w-5" />
                </div>
                <div className="dashboard__goal-info">
                  <span className="dashboard__goal-label">{goal.label}</span>
                  <div className="dashboard__goal-values">
                    <span className="dashboard__goal-current">{goal.current}</span>
                    <span className="dashboard__goal-separator">/</span>
                    <span className="dashboard__goal-target">{goal.target}</span>
                  </div>
                  <div className="dashboard__goal-progress">
                    <div className="dashboard__goal-progress-bar">
                      <div
                        className="dashboard__goal-progress-fill"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: goal.color
                        }}
                      />
                    </div>
                    <span className="dashboard__goal-percentage">{Math.round(percentage)}%</span>
                  </div>
                  <span className="dashboard__goal-description">{goal.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 콘텐츠 그리드 */}
      <div className="dashboard__grid">
        {/* 주간 활동 그래프 */}
        <Card className="dashboard__chart-card">
          <CardHeader className="dashboard__card-header">
            <CardTitle className="dashboard__card-title">
              <BarChart3 className="h-5 w-5" />
              주간 활동
            </CardTitle>
            <div className="dashboard__chart-legend">
              <span className="dashboard__chart-legend-item">
                <span className="dashboard__chart-legend-dot dashboard__chart-legend-dot--posts" />
                게시글
              </span>
              <span className="dashboard__chart-legend-item">
                <span className="dashboard__chart-legend-dot dashboard__chart-legend-dot--comments" />
                댓글
              </span>
            </div>
          </CardHeader>
          <CardContent className="dashboard__chart-content">
            <div className="dashboard__chart-wrapper">
              {/* Y축 눈금 */}
              <div className="dashboard__chart-y-axis">
                {[...Array(5)].map((_, i) => {
                  const maxValue = Math.max(...weeklyActivity.map(d => d.posts + d.comments));
                  const value = Math.round(maxValue * (4 - i) / 4);
                  return (
                    <div key={i} className="dashboard__chart-y-label">
                      {value}
                    </div>
                  );
                })}
                <div className="dashboard__chart-y-label">0</div>
              </div>

              {/* 차트 영역 */}
              <div className="dashboard__chart">
                {weeklyActivity.map((day, index) => {
                  const maxValue = Math.max(...weeklyActivity.map(d => d.posts + d.comments));
                  const postsHeight = (day.posts / maxValue) * 100;
                  const commentsHeight = (day.comments / maxValue) * 100;
                  const totalHeight = ((day.posts + day.comments) / maxValue) * 100;
                  const isHovered = hoveredBar === index;

                  return (
                    <div
                      key={day.day}
                      className="dashboard__chart-bar-wrapper"
                      onMouseEnter={() => setHoveredBar(index)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      <div className="dashboard__chart-bar-container">
                        <div
                          className={`dashboard__chart-bar ${isHovered ? 'dashboard__chart-bar--hovered' : ''}`}
                          style={{ height: `${totalHeight}%` }}
                        >
                          <div
                            className="dashboard__chart-bar-segment dashboard__chart-bar-segment--posts"
                            style={{ height: `${(postsHeight / totalHeight) * 100}%` }}
                          />
                          <div
                            className="dashboard__chart-bar-segment dashboard__chart-bar-segment--comments"
                            style={{ height: `${(commentsHeight / totalHeight) * 100}%` }}
                          />
                        </div>
                        {isHovered && (
                          <div className="dashboard__chart-tooltip">
                            <div className="dashboard__chart-tooltip-row">
                              <span>게시글</span>
                              <strong>{day.posts}개</strong>
                            </div>
                            <div className="dashboard__chart-tooltip-row">
                              <span>댓글</span>
                              <strong>{day.comments}개</strong>
                            </div>
                            <div className="dashboard__chart-tooltip-row">
                              <span>좋아요</span>
                              <strong>{day.likes}개</strong>
                            </div>
                            <div className="dashboard__chart-tooltip-divider" />
                            <div className="dashboard__chart-tooltip-row dashboard__chart-tooltip-total">
                              <span>총 활동</span>
                              <strong>{day.posts + day.comments}개</strong>
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="dashboard__chart-label">{day.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 최근 활동 */}
        <Card className="dashboard__activity-card">
          <CardHeader className="dashboard__card-header">
            <CardTitle className="dashboard__card-title">
              <Activity className="h-5 w-5" />
              최근 활동
            </CardTitle>
          </CardHeader>
          <CardContent className="dashboard__activity-list">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className={`dashboard__activity-item ${hoveredActivity === index ? 'dashboard__activity-item--hovered' : ''}`}
                onMouseEnter={() => setHoveredActivity(index)}
                onMouseLeave={() => setHoveredActivity(null)}
              >
                <div
                  className="dashboard__activity-icon"
                  style={{ backgroundColor: `${activity.color}20`, color: activity.color }}
                >
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="dashboard__activity-info">
                  <span className="dashboard__activity-content">{activity.content}</span>
                  {hoveredActivity === index && (
                    <span className="dashboard__activity-detail">{activity.detail}</span>
                  )}
                </div>
                <span className="dashboard__activity-time">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 인기 게시글 */}
        <Card className="dashboard__popular-card">
          <CardHeader className="dashboard__card-header" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <CardTitle className="dashboard__card-title">
              <TrendingUp className="h-5 w-5" />
              인기 게시글
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/board">
                더보기 <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="dashboard__popular-content">
            <div className="dashboard__popular-list">
              {popularPosts.map((post, index) => (
                <Link key={post.id} href={`/board/${post.id}`} className="dashboard__popular-item">
                  <div className="dashboard__popular-item-left">
                    <span className="dashboard__popular-rank">#{index + 1}</span>
                    <div className="dashboard__popular-item-main">
                      <h4 className="dashboard__popular-title">{post.title}</h4>
                      <div className="dashboard__popular-author">
                        <UserAvatar
                          src={post.author.image}
                          name={post.author.name}
                          size="xs"
                        />
                        <span className="dashboard__popular-author-name">{post.author.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="dashboard__popular-item-right">
                    <div className="dashboard__popular-stats">
                      <span className="dashboard__popular-stat">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{post.views}</span>
                      </span>
                      <span className="dashboard__popular-stat">
                        <Heart className="h-3.5 w-3.5" />
                        <span>{post.likes}</span>
                      </span>
                      <span className="dashboard__popular-stat">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{post.comments}</span>
                      </span>
                    </div>
                    <TrendingUp
                      className={`dashboard__popular-trend dashboard__popular-trend--${post.trend}`}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
