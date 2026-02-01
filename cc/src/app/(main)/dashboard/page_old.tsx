'use client';

import Link from 'next/link';
import {
  FileText,
  MessageCircle,
  Users,
  TrendingUp,
  ArrowRight,
  Calendar,
  Heart,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/mocks/users';
import '../dashboard.css';

// 통계 데이터
const stats = [
  { label: '내 게시글', value: 12, icon: FileText, color: 'hsl(280, 55%, 55%)', href: '/board' },
  { label: '받은 좋아요', value: 48, icon: Heart, color: 'hsl(350, 55%, 55%)', href: '/board' },
  { label: '안 읽은 채팅', value: 3, icon: MessageCircle, color: 'hsl(200, 60%, 50%)', href: '/chat' },
  { label: '친구', value: 8, icon: Users, color: 'hsl(160, 55%, 45%)', href: '/friends' },
  { label: '작성한 댓글', value: 34, icon: MessageCircle, color: 'hsl(45, 70%, 55%)', href: '/board' },
  { label: '게시글 조회수', value: 256, icon: Eye, color: 'hsl(220, 60%, 55%)', href: '/board' },
];

// 최근 활동
const recentActivities = [
  { type: 'post', content: '새 게시글을 작성했습니다', time: '2시간 전', user: '나' },
  { type: 'like', content: '홍길동님이 좋아요를 눌렀습니다', time: '3시간 전', user: '홍길동' },
  { type: 'comment', content: '새 댓글이 달렸습니다: "좋은 글 감사합니다!"', time: '5시간 전', user: '이서연' },
  { type: 'friend', content: '이서연님과 친구가 되었습니다', time: '1일 전', user: '이서연' },
  { type: 'like', content: '김철수님이 좋아요를 눌렀습니다', time: '1일 전', user: '김철수' },
  { type: 'post', content: '게시글이 100회 조회되었습니다', time: '2일 전', user: '시스템' },
];

// 인기 게시글
const popularPosts = [
  { id: '1', title: '오늘 날씨가 정말 좋네요!', views: 128, likes: 24, comments: 8 },
  { id: '2', title: 'Next.js 14 업데이트 정리', views: 256, likes: 42, comments: 15 },
  { id: '3', title: '주말 나들이 추천 장소', views: 89, likes: 15, comments: 6 },
  { id: '4', title: 'TypeScript 베스트 프랙티스', views: 178, likes: 31, comments: 12 },
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

export default function DashboardPage() {
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
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="dashboard__stat-card">
              <CardContent className="dashboard__stat-content">
                <div
                  className="dashboard__stat-icon"
                  style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="dashboard__stat-info">
                  <span className="dashboard__stat-value">{stat.value}</span>
                  <span className="dashboard__stat-label">{stat.label}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* 콘텐츠 그리드 */}
      <div className="dashboard__grid">
        {/* 주간 활동 그래프 */}
        <Card className="dashboard__chart-card">
          <CardHeader className="dashboard__card-header">
            <CardTitle className="dashboard__card-title">
              <TrendingUp className="h-5 w-5" />
              주간 활동
            </CardTitle>
          </CardHeader>
          <CardContent className="dashboard__chart-content">
            <div className="dashboard__chart">
              {weeklyActivity.map((day) => {
                const maxValue = Math.max(...weeklyActivity.map(d => d.posts + d.comments));
                const height = ((day.posts + day.comments) / maxValue) * 100;
                return (
                  <div key={day.day} className="dashboard__chart-bar-wrapper">
                    <div className="dashboard__chart-bar-container">
                      <div
                        className="dashboard__chart-bar"
                        style={{ height: `${height}%` }}
                        title={`게시글: ${day.posts}, 댓글: ${day.comments}`}
                      />
                    </div>
                    <span className="dashboard__chart-label">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 최근 활동 */}
        <Card className="dashboard__activity-card">
          <CardHeader className="dashboard__card-header">
            <CardTitle className="dashboard__card-title">
              <TrendingUp className="h-5 w-5" />
              최근 활동
            </CardTitle>
          </CardHeader>
          <CardContent className="dashboard__activity-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="dashboard__activity-item">
                <span className="dashboard__activity-content">{activity.content}</span>
                <span className="dashboard__activity-time">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 인기 게시글 */}
        <Card className="dashboard__popular-card">
          <CardHeader className="dashboard__card-header">
            <CardTitle className="dashboard__card-title">
              <Heart className="h-5 w-5" />
              인기 게시글
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/board">
                더보기 <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="dashboard__popular-list">
            {popularPosts.map((post) => (
              <Link key={post.id} href={`/board/${post.id}`} className="dashboard__popular-item">
                <span className="dashboard__popular-title">{post.title}</span>
                <div className="dashboard__popular-stats">
                  <span><Eye className="h-3 w-3" /> {post.views}</span>
                  <span><Heart className="h-3 w-3" /> {post.likes}</span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 빠른 액션 */}
      <div className="dashboard__actions">
        <Button asChild>
          <Link href="/board/write">
            <FileText className="mr-2 h-4 w-4" />
            새 글 작성
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/chat">
            <MessageCircle className="mr-2 h-4 w-4" />
            채팅 시작
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/friends">
            <Users className="mr-2 h-4 w-4" />
            친구 찾기
          </Link>
        </Button>
      </div>
    </div>
  );
}
