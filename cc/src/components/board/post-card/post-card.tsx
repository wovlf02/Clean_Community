'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/common/user-avatar';
import { RelativeTime } from '@/components/common/relative-time';
import type { Post, PostCategory } from '@/types/post';
import { truncate } from '@/lib/utils';
import './post-card.css';

interface PostCardProps {
  post: Post;
}

const categoryLabels: Record<PostCategory, string> = {
  general: '일반',
  qna: 'Q&A',
  info: '정보공유',
  daily: '일상',
};

// 감정 라벨 설정
const getSentimentDisplay = (score?: number, label?: string) => {
  if (score === undefined) return null;

  const absScore = Math.abs(score);

  if (label === 'warning') {
    return { emoji: '⚠️', color: 'sentiment--warning', text: `${absScore}` };
  }
  if (label === 'negative' || score < -20) {
    return { emoji: '😟', color: 'sentiment--negative', text: `-${absScore}` };
  }
  if (label === 'positive' || score > 20) {
    return { emoji: '😊', color: 'sentiment--positive', text: `+${absScore}` };
  }
  return { emoji: '😐', color: 'sentiment--neutral', text: `${absScore}` };
};

export function PostCard({ post }: PostCardProps) {
  const sentiment = getSentimentDisplay(post.sentimentScore, post.sentimentLabel);

  return (
    <Link href={`/board/${post.id}`}>
      <Card className="post-card">
        {/* 카드 헤더 - 카테고리, 감정점수, 등록시각 */}
        <div className="post-card__header">
          <div className="post-card__header-left">
            <Badge variant="secondary" className="post-card__category">
              {categoryLabels[post.category]}
            </Badge>
            {sentiment && (
              <span className={`post-card__sentiment ${sentiment.color}`}>
                {sentiment.emoji} {sentiment.text}
              </span>
            )}
          </div>
          <RelativeTime date={post.createdAt} className="post-card__time" />
        </div>

        {/* 제목 */}
        <h3 className="post-card__title">{post.title}</h3>

        {/* 본문 미리보기 */}
        <p className="post-card__excerpt">
          {truncate(post.content, 100)}
        </p>

        {/* 썸네일 (작게, 선택적) */}
        {post.thumbnailUrl && (
          <div className="post-card__thumbnail">
            <Image
              src={post.thumbnailUrl}
              alt=""
              fill
              sizes="48px"
            />
          </div>
        )}

        {/* 푸터 */}
        <div className="post-card__footer">
          {/* 작성자 */}
          <div className="post-card__author">
            <UserAvatar
              src={post.author.image}
              name={post.author.nickname}
              size="xs"
            />
            <span className="post-card__author-name">{post.author.nickname}</span>
          </div>

          {/* 통계 */}
          <div className="post-card__stats">
            <span className="post-card__stat">
              <Eye className="h-3 w-3" />
              {post.viewCount}
            </span>
            <span className="post-card__stat">
              <Heart className="h-3 w-3" />
              {post.likeCount}
            </span>
            <span className="post-card__stat">
              <MessageCircle className="h-3 w-3" />
              {post.commentCount}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
