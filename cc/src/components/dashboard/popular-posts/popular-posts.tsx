'use client';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { posts } from '@/mocks/posts';
import './popular-posts.css';

export function PopularPosts() {
  // 좋아요 순 정렬
  const popularPosts = [...posts]
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
