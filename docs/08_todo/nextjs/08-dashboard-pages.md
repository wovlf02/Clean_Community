# Phase 8: 대시보드 화면 개발

**관련 문서**: [대시보드 화면 설계](../../05_screens/05_dashboard/) | [기능 요구사항](../../02_requirements/functional.md)

---

## 📋 개요

사용자 활동 통계, 인기 게시글, 최근 활동을 표시하는 대시보드(홈) 화면을 구현합니다.

**예상 소요 시간**: 2일

---

## ✅ 체크리스트

### 1. 대시보드 Mock 데이터

```typescript
// mocks/dashboard.ts
export const mockDashboardStats = {
  totalPosts: 45,
  totalComments: 128,
  totalLikes: 312,
  totalMessages: 89,
};

export const mockWeeklyActivity = [
  { day: '월', posts: 3, comments: 8 },
  { day: '화', posts: 2, comments: 5 },
  { day: '수', posts: 5, comments: 12 },
  { day: '목', posts: 1, comments: 3 },
  { day: '금', posts: 4, comments: 9 },
  { day: '토', posts: 6, comments: 15 },
  { day: '일', posts: 2, comments: 6 },
];

export const mockRecentActivities = [
  {
    id: 'activity-1',
    type: 'post',
    title: '새 게시글을 작성했습니다',
    description: '안녕하세요! 첫 게시글입니다',
    createdAt: '2024-01-15T14:30:00Z',
  },
  {
    id: 'activity-2',
    type: 'comment',
    title: '댓글을 작성했습니다',
    description: '좋은 글이네요!',
    createdAt: '2024-01-15T13:00:00Z',
  },
  // ... 더 많은 활동
];
```

- [ ] 통계 Mock 데이터 생성
- [ ] 주간 활동 Mock 데이터 생성
- [ ] 최근 활동 Mock 데이터 생성

---

### 2. 통계 카드 컴포넌트

```css
/* components/dashboard/stat-card/stat-card.css */

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  border-radius: 0.75rem;
  background-color: rgb(var(--card));
  border: 1px solid rgb(var(--border));
}

.stat-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-card__title {
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
}

.stat-card__icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background-color: rgb(var(--accent));
  color: rgb(var(--primary));
}

.stat-card__value {
  font-size: 2rem;
  font-weight: 700;
  color: rgb(var(--foreground));
  line-height: 1;
}

.stat-card__change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
}

.stat-card__change--up {
  color: rgb(34 197 94);
}

.stat-card__change--down {
  color: rgb(239 68 68);
}
```

```typescript
// components/dashboard/stat-card/stat-card.tsx
'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import './stat-card.css';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  change?: number;
  changeLabel?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel,
}: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="stat-card">
      <div className="stat-card__header">
        <span className="stat-card__title">{title}</span>
        <div className="stat-card__icon">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="stat-card__value">{value.toLocaleString()}</div>
      {change !== undefined && (
        <div
          className={cn(
            'stat-card__change',
            isPositive && 'stat-card__change--up',
            isNegative && 'stat-card__change--down'
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : isNegative ? (
            <TrendingDown className="h-3 w-3" />
          ) : null}
          <span>
            {isPositive && '+'}
            {change}% {changeLabel}
          </span>
        </div>
      )}
    </div>
  );
}
```

- [ ] stat-card.css 파일 생성
- [ ] StatCard 컴포넌트 생성
- [ ] 증감 표시 (화살표 + 색상)

---

### 3. 활동 차트 컴포넌트

```typescript
// components/dashboard/activity-chart/activity-chart.tsx
'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockWeeklyActivity } from '@/mocks/dashboard';
import './activity-chart.css';

export function ActivityChart() {
  return (
    <Card className="activity-chart">
      <CardHeader>
        <CardTitle>주간 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockWeeklyActivity}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="posts"
              name="게시글"
              fill="rgb(59, 130, 246)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="comments"
              name="댓글"
              fill="rgb(147, 197, 253)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

- [ ] activity-chart.css 파일 생성
- [ ] ActivityChart 컴포넌트 (Recharts)
- [ ] 반응형 차트

---

### 4. 인기 게시글 섹션

```typescript
// components/dashboard/popular-posts/popular-posts.tsx
'use client';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockPosts } from '@/mocks/posts';
import './popular-posts.css';

export function PopularPosts() {
  // 좋아요 순 정렬
  const popularPosts = [...mockPosts]
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 5);

  return (
    <Card className="popular-posts">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          인기 게시글
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="popular-posts__list">
          {popularPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/board/${post.id}`}
              className="popular-posts__item"
            >
              <span className="popular-posts__rank">{index + 1}</span>
              <div className="popular-posts__content">
                <span className="popular-posts__title">{post.title}</span>
                <span className="popular-posts__stats">
                  ❤️ {post.likeCount} · 💬 {post.commentCount}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] popular-posts.css 파일 생성
- [ ] PopularPosts 컴포넌트
- [ ] 순위 표시

---

### 5. 최근 활동 타임라인

- [ ] RecentActivity 컴포넌트
- [ ] 활동 타입별 아이콘
- [ ] 시간 표시

---

### 6. 대시보드 페이지 (/)

```typescript
// app/(main)/page.tsx
'use client';

import { FileText, MessageCircle, Heart, Send } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { ActivityChart } from '@/components/dashboard/activity-chart';
import { PopularPosts } from '@/components/dashboard/popular-posts';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { mockDashboardStats } from '@/mocks/dashboard';
import './dashboard.css';

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <h1 className="dashboard__title">대시보드</h1>

      {/* 통계 카드 */}
      <div className="dashboard__stats">
        <StatCard
          title="총 게시글"
          value={mockDashboardStats.totalPosts}
          icon={FileText}
          change={12}
          changeLabel="지난주 대비"
        />
        <StatCard
          title="총 댓글"
          value={mockDashboardStats.totalComments}
          icon={MessageCircle}
          change={8}
          changeLabel="지난주 대비"
        />
        <StatCard
          title="받은 좋아요"
          value={mockDashboardStats.totalLikes}
          icon={Heart}
          change={24}
          changeLabel="지난주 대비"
        />
        <StatCard
          title="주고받은 메시지"
          value={mockDashboardStats.totalMessages}
          icon={Send}
          change={-5}
          changeLabel="지난주 대비"
        />
      </div>

      {/* 차트 & 인기 게시글 */}
      <div className="dashboard__row">
        <ActivityChart />
        <PopularPosts />
      </div>

      {/* 최근 활동 */}
      <RecentActivity />
    </div>
  );
}
```

- [ ] dashboard.css 파일 생성
- [ ] 대시보드 레이아웃 구현
- [ ] 그리드 배치

---

## 📁 생성되는 파일 목록

```
cc/src/
├── app/(main)/
│   ├── page.tsx
│   └── dashboard.css
├── components/dashboard/
│   ├── stat-card/
│   ├── activity-chart/
│   ├── popular-posts/
│   └── recent-activity/
└── mocks/
    └── dashboard.ts
```

---

## ✅ 완료 조건

- [ ] 대시보드 Mock 데이터 생성
- [ ] StatCard 컴포넌트 완료
- [ ] ActivityChart 컴포넌트 완료 (Recharts)
- [ ] PopularPosts 컴포넌트 완료
- [ ] RecentActivity 컴포넌트 완료
- [ ] 대시보드 페이지 레이아웃 완료
- [ ] 반응형 그리드 확인
- [ ] 프로젝트 빌드 성공 (`npm run build`)

---

**이전 단계**: [Phase 7: 친구 관리 화면 개발](./07-friends-pages.md)

**다음 단계**: [Phase 9: 설정 화면 개발](./09-settings-pages.md)
