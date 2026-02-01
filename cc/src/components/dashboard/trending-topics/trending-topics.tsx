'use client';

import Link from 'next/link';
import { TrendingUp, Hash, Flame, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import './trending-topics.css';

const trendingTopics = [
  { tag: 'Next.js', count: 234, trend: 'hot', change: '+45%' },
  { tag: 'TypeScript', count: 189, trend: 'rising', change: '+23%' },
  { tag: 'AI', count: 156, trend: 'hot', change: '+67%' },
  { tag: 'React', count: 145, trend: 'stable', change: '+5%' },
  { tag: '개발후기', count: 134, trend: 'rising', change: '+18%' },
  { tag: '취업', count: 128, trend: 'stable', change: '+3%' },
  { tag: '스터디모집', count: 112, trend: 'new', change: 'NEW' },
  { tag: 'TailwindCSS', count: 98, trend: 'rising', change: '+12%' },
];

const trendIcons = {
  hot: { icon: Flame, color: 'hsl(0, 72%, 51%)' },
  rising: { icon: TrendingUp, color: 'hsl(142, 76%, 36%)' },
  stable: { icon: Clock, color: 'hsl(37, 91%, 55%)' },
  new: { icon: Hash, color: 'hsl(262, 83%, 58%)' },
};

export function TrendingTopics() {
  return (
    <Card className="trending-topics">
      <CardHeader>
        <CardTitle className="trending-topics__title">
          <TrendingUp className="h-5 w-5" />
          트렌딩 토픽
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="trending-topics__list">
          {trendingTopics.map((topic, index) => {
            const trendInfo = trendIcons[topic.trend as keyof typeof trendIcons];
            const TrendIcon = trendInfo.icon;

            return (
              <Link
                key={topic.tag}
                href={`/board?tag=${topic.tag}`}
                className="trending-topics__item"
              >
                <span className="trending-topics__rank">{index + 1}</span>
                <div className="trending-topics__content">
                  <div className="trending-topics__tag">
                    <Hash className="h-3.5 w-3.5" />
                    {topic.tag}
                  </div>
                  <span className="trending-topics__count">
                    게시글 {topic.count}개
                  </span>
                </div>
                <div
                  className="trending-topics__trend"
                  style={{ color: trendInfo.color }}
                >
                  <TrendIcon className="h-3.5 w-3.5" />
                  <span>{topic.change}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
