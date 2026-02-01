'use client';

import { useState, useMemo } from 'react';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  MessageCircle,
  BarChart3,
  Flame,
  Target,
  Award,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { weeklyActivity } from '@/mocks/dashboard';
import './activity-chart.css';

type ViewMode = 'bar' | 'line';
type TimeRange = 'week' | 'month';

interface DayData {
  day: string;
  fullDate: string;
  posts: number;
  comments: number;
  total: number;
  isToday: boolean;
  isWeekend: boolean;
}

// 확장된 월간 데이터 생성
const generateMonthlyData = (): DayData[] => {
  const today = new Date();
  const data: DayData[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // 주말에는 활동이 더 많도록 시뮬레이션
    const basePosts = isWeekend ? Math.floor(Math.random() * 6) + 2 : Math.floor(Math.random() * 4) + 1;
    const baseComments = isWeekend ? Math.floor(Math.random() * 12) + 4 : Math.floor(Math.random() * 8) + 2;

    data.push({
      day: date.getDate().toString(),
      fullDate: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' }),
      posts: basePosts,
      comments: baseComments,
      total: basePosts + baseComments,
      isToday: i === 0,
      isWeekend,
    });
  }

  return data;
};

// 주간 데이터 변환
const weeklyData: DayData[] = weeklyActivity.map((d, i) => ({
  day: d.day,
  fullDate: `${d.day}요일`,
  posts: d.posts,
  comments: d.comments,
  total: d.posts + d.comments,
  isToday: i === weeklyActivity.length - 1,
  isWeekend: d.day === '토' || d.day === '일',
}));

export function ActivityChart() {
  const [viewMode, setViewMode] = useState<ViewMode>('bar');
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const monthlyData = useMemo(() => generateMonthlyData(), []);
  const data = timeRange === 'week' ? weeklyData : monthlyData;

  const maxValue = Math.max(...data.map((d) => Math.max(d.posts, d.comments)));

  // 통계 계산
  const stats = useMemo(() => {
    const totalPosts = data.reduce((sum, d) => sum + d.posts, 0);
    const totalComments = data.reduce((sum, d) => sum + d.comments, 0);
    const avgPosts = (totalPosts / data.length).toFixed(1);
    const avgComments = (totalComments / data.length).toFixed(1);

    // 이전 기간 대비 변화율 (시뮬레이션)
    const postsChange = Math.floor(Math.random() * 40) - 10;
    const commentsChange = Math.floor(Math.random() * 30) - 5;

    // 연속 활동일 계산
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].total > 0) streak++;
      else break;
    }

    // 최고 활동일
    const maxActivityIndex = data.reduce((maxIdx, d, idx, arr) =>
      d.total > arr[maxIdx].total ? idx : maxIdx, 0);

    return {
      totalPosts,
      totalComments,
      avgPosts,
      avgComments,
      postsChange,
      commentsChange,
      streak,
      bestDay: data[maxActivityIndex],
      bestDayIndex: maxActivityIndex,
    };
  }, [data]);

  const activeData = hoveredIndex !== null ? data[hoveredIndex] :
                     selectedIndex !== null ? data[selectedIndex] : null;

  const getBarHeight = (value: number) => {
    return maxValue > 0 ? `${(value / maxValue) * 100}%` : '0%';
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3.5 w-3.5" />;
    if (change < 0) return <TrendingDown className="h-3.5 w-3.5" />;
    return <Minus className="h-3.5 w-3.5" />;
  };

  const getTrendClass = (change: number) => {
    if (change > 0) return 'activity-chart__trend--up';
    if (change < 0) return 'activity-chart__trend--down';
    return 'activity-chart__trend--neutral';
  };

  // 라인 차트용 SVG 경로 생성
  const generatePath = (values: number[]) => {
    const padding = 16;
    const width = 100;
    const height = 120;

    const points = values.map((v, i) => ({
      x: padding + (i * (width - padding * 2)) / (values.length - 1),
      y: height - padding - (v / maxValue) * (height - padding * 2),
    }));

    return points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      const prev = points[i - 1];
      const cpx1 = prev.x + (point.x - prev.x) / 3;
      const cpx2 = prev.x + (2 * (point.x - prev.x)) / 3;
      return `${acc} C ${cpx1} ${prev.y}, ${cpx2} ${point.y}, ${point.x} ${point.y}`;
    }, '');
  };

  return (
    <Card className="activity-chart">
      <CardHeader className="activity-chart__header">
        <div className="activity-chart__header-left">
          <CardTitle className="activity-chart__title">
            <BarChart3 className="h-5 w-5" />
            주간 활동
          </CardTitle>
          <p className="activity-chart__subtitle">
            {timeRange === 'week' ? '이번 주' : '최근 30일'} 활동 내역
          </p>
        </div>
        <div className="activity-chart__controls">
          <div className="activity-chart__time-toggle">
            <button
              className={`activity-chart__toggle-btn ${timeRange === 'week' ? 'activity-chart__toggle-btn--active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              주간
            </button>
            <button
              className={`activity-chart__toggle-btn ${timeRange === 'month' ? 'activity-chart__toggle-btn--active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              월간
            </button>
          </div>
          <div className="activity-chart__view-toggle">
            <button
              className={`activity-chart__view-btn ${viewMode === 'bar' ? 'activity-chart__view-btn--active' : ''}`}
              onClick={() => setViewMode('bar')}
              title="막대 그래프"
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              className={`activity-chart__view-btn ${viewMode === 'line' ? 'activity-chart__view-btn--active' : ''}`}
              onClick={() => setViewMode('line')}
              title="라인 그래프"
            >
              <TrendingUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* 요약 통계 */}
        <div className="activity-chart__summary">
          <div className="activity-chart__summary-card">
            <div className="activity-chart__summary-icon activity-chart__summary-icon--posts">
              <FileText className="h-4 w-4" />
            </div>
            <div className="activity-chart__summary-content">
              <span className="activity-chart__summary-label">게시글</span>
              <span className="activity-chart__summary-value">{stats.totalPosts}</span>
              <span className={`activity-chart__summary-change ${getTrendClass(stats.postsChange)}`}>
                {getTrendIcon(stats.postsChange)}
                {stats.postsChange > 0 ? '+' : ''}{stats.postsChange}%
              </span>
            </div>
          </div>
          <div className="activity-chart__summary-card">
            <div className="activity-chart__summary-icon activity-chart__summary-icon--comments">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="activity-chart__summary-content">
              <span className="activity-chart__summary-label">댓글</span>
              <span className="activity-chart__summary-value">{stats.totalComments}</span>
              <span className={`activity-chart__summary-change ${getTrendClass(stats.commentsChange)}`}>
                {getTrendIcon(stats.commentsChange)}
                {stats.commentsChange > 0 ? '+' : ''}{stats.commentsChange}%
              </span>
            </div>
          </div>
          <div className="activity-chart__summary-card activity-chart__summary-card--highlight">
            <div className="activity-chart__summary-icon activity-chart__summary-icon--streak">
              <Flame className="h-4 w-4" />
            </div>
            <div className="activity-chart__summary-content">
              <span className="activity-chart__summary-label">연속 활동</span>
              <span className="activity-chart__summary-value">{stats.streak}일</span>
              <span className="activity-chart__summary-badge">🔥 진행 중</span>
            </div>
          </div>
        </div>

        {/* 차트 영역 */}
        <div className="activity-chart__chart-container">
          {/* Y축 가이드라인 */}
          <div className="activity-chart__y-axis">
            <span>{maxValue}</span>
            <span>{Math.round(maxValue / 2)}</span>
            <span>0</span>
          </div>

          {viewMode === 'bar' ? (
            <div className="activity-chart__bars">
              {data.map((d, index) => (
                <div
                  key={index}
                  className={`activity-chart__bar-group ${
                    d.isToday ? 'activity-chart__bar-group--today' : ''
                  } ${
                    hoveredIndex === index ? 'activity-chart__bar-group--hovered' : ''
                  } ${
                    selectedIndex === index ? 'activity-chart__bar-group--selected' : ''
                  } ${
                    index === stats.bestDayIndex ? 'activity-chart__bar-group--best' : ''
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
                >
                  {/* 툴팁 */}
                  {(hoveredIndex === index || selectedIndex === index) && (
                    <div className="activity-chart__tooltip">
                      <div className="activity-chart__tooltip-header">
                        <Calendar className="h-3.5 w-3.5" />
                        {d.fullDate}
                        {d.isToday && <span className="activity-chart__tooltip-today">오늘</span>}
                        {index === stats.bestDayIndex && <Award className="h-3.5 w-3.5 text-yellow-500" />}
                      </div>
                      <div className="activity-chart__tooltip-stats">
                        <div className="activity-chart__tooltip-stat">
                          <span className="activity-chart__tooltip-dot activity-chart__tooltip-dot--posts" />
                          <span>게시글</span>
                          <strong>{d.posts}</strong>
                        </div>
                        <div className="activity-chart__tooltip-stat">
                          <span className="activity-chart__tooltip-dot activity-chart__tooltip-dot--comments" />
                          <span>댓글</span>
                          <strong>{d.comments}</strong>
                        </div>
                        <div className="activity-chart__tooltip-total">
                          <span>총 활동</span>
                          <strong>{d.total}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="activity-chart__bar-wrapper">
                    {/* 배경 가이드 */}
                    <div className="activity-chart__bar-bg" />

                    {/* 막대 */}
                    <div className="activity-chart__bar-container">
                      <div
                        className="activity-chart__bar activity-chart__bar--posts"
                        style={{ height: getBarHeight(d.posts) }}
                      >
                        {d.posts > 0 && hoveredIndex === index && (
                          <span className="activity-chart__bar-value">{d.posts}</span>
                        )}
                      </div>
                      <div
                        className="activity-chart__bar activity-chart__bar--comments"
                        style={{ height: getBarHeight(d.comments) }}
                      >
                        {d.comments > 0 && hoveredIndex === index && (
                          <span className="activity-chart__bar-value">{d.comments}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className={`activity-chart__label ${d.isToday ? 'activity-chart__label--today' : ''} ${d.isWeekend ? 'activity-chart__label--weekend' : ''}`}>
                    {d.day}
                    {d.isToday && <span className="activity-chart__today-dot" />}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="activity-chart__line-chart">
              <svg viewBox="0 0 100 120" preserveAspectRatio="none" className="activity-chart__svg">
                {/* 그리드 라인 */}
                <defs>
                  <linearGradient id="postsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(59 130 246)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="rgb(59 130 246)" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="commentsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(139 92 246)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="rgb(139 92 246)" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* 게시글 라인 */}
                <path
                  d={generatePath(data.map(d => d.posts))}
                  fill="none"
                  stroke="rgb(59 130 246)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="activity-chart__line activity-chart__line--posts"
                />

                {/* 댓글 라인 */}
                <path
                  d={generatePath(data.map(d => d.comments))}
                  fill="none"
                  stroke="rgb(139 92 246)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="activity-chart__line activity-chart__line--comments"
                />

                {/* 데이터 포인트 */}
                {data.map((d, i) => {
                  const x = 16 + (i * 68) / (data.length - 1);
                  const yPosts = 120 - 16 - (d.posts / maxValue) * 88;
                  const yComments = 120 - 16 - (d.comments / maxValue) * 88;

                  return (
                    <g key={i}>
                      <circle
                        cx={x}
                        cy={yPosts}
                        r={hoveredIndex === i ? 4 : 2.5}
                        fill="rgb(59 130 246)"
                        className="activity-chart__point"
                      />
                      <circle
                        cx={x}
                        cy={yComments}
                        r={hoveredIndex === i ? 4 : 2.5}
                        fill="rgb(139 92 246)"
                        className="activity-chart__point"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* X축 레이블 */}
              <div className="activity-chart__x-labels">
                {data.filter((_, i) => timeRange === 'week' || i % 5 === 0 || i === data.length - 1).map((d, i) => (
                  <span key={i} className={d.isToday ? 'activity-chart__label--today' : ''}>
                    {d.day}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 선택된 날짜 상세 정보 */}
        {activeData && (
          <div className="activity-chart__detail-panel">
            <div className="activity-chart__detail-header">
              <Calendar className="h-4 w-4" />
              <span>{activeData.fullDate} 상세</span>
              {activeData.isToday && (
                <span className="activity-chart__detail-badge">오늘</span>
              )}
            </div>
            <div className="activity-chart__detail-content">
              <div className="activity-chart__detail-stat">
                <div className="activity-chart__detail-bar">
                  <div
                    className="activity-chart__detail-fill activity-chart__detail-fill--posts"
                    style={{ width: `${(activeData.posts / maxValue) * 100}%` }}
                  />
                </div>
                <span className="activity-chart__detail-label">게시글</span>
                <span className="activity-chart__detail-value">{activeData.posts}개</span>
              </div>
              <div className="activity-chart__detail-stat">
                <div className="activity-chart__detail-bar">
                  <div
                    className="activity-chart__detail-fill activity-chart__detail-fill--comments"
                    style={{ width: `${(activeData.comments / maxValue) * 100}%` }}
                  />
                </div>
                <span className="activity-chart__detail-label">댓글</span>
                <span className="activity-chart__detail-value">{activeData.comments}개</span>
              </div>
            </div>
          </div>
        )}

        {/* 범례 */}
        <div className="activity-chart__legend">
          <div className="activity-chart__legend-item">
            <div className="activity-chart__legend-dot activity-chart__legend-dot--posts" />
            <span>게시글</span>
            <span className="activity-chart__legend-avg">평균 {stats.avgPosts}개/일</span>
          </div>
          <div className="activity-chart__legend-item">
            <div className="activity-chart__legend-dot activity-chart__legend-dot--comments" />
            <span>댓글</span>
            <span className="activity-chart__legend-avg">평균 {stats.avgComments}개/일</span>
          </div>
        </div>

        {/* 인사이트 */}
        <div className="activity-chart__insights">
          <div className="activity-chart__insight">
            <Target className="h-4 w-4" />
            <span>
              <strong>{stats.bestDay.fullDate}</strong>에 가장 활발하게 활동했어요! (총 {stats.bestDay.total}회)
            </span>
          </div>
          {stats.streak >= 3 && (
            <div className="activity-chart__insight activity-chart__insight--highlight">
              <Flame className="h-4 w-4" />
              <span>
                <strong>{stats.streak}일 연속</strong> 활동 중이에요! 대단해요 🎉
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
