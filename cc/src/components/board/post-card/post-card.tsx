'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/common/user-avatar';
import { RelativeTime } from '@/components/common/relative-time';
import { SentimentBadge } from '@/components/common/sentiment-badge';
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

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/board/${post.id}`}>
      <Card className="post-card">
        {/* 메인 컨텐츠 영역 */}
        <div className="post-card__main">
          {/* 좌측: 카테고리 + 제목 + 내용 */}
          <div className="post-card__left">
            {/* 카테고리 */}
            <Badge variant="secondary" className="post-card__category">
              {categoryLabels[post.category]}
            </Badge>

            {/* 제목 */}
            <h3 className="post-card__title">{post.title}</h3>

            {/* 본문 미리보기 */}
            <p className="post-card__excerpt">
              {truncate(post.content, 100)}
            </p>
          </div>

          {/* 우측: 등록일자 + 점수 + 썸네일 */}
          <div className="post-card__right">
            {/* 등록시각 */}
            <RelativeTime date={post.createdAt} className="post-card__time" />

            {/* 감정분석 점수 */}
            {post.sentimentPredictions && (
              <SentimentBadge
                predictions={post.sentimentPredictions}
                showScore
                showText
                size="sm"
              />
            )}

            {/* 썸네일 */}
            {post.thumbnailUrl && (
              <div className="post-card__thumbnail">
                <Image
                  src={post.thumbnailUrl}
                  alt=""
                  fill
                  sizes="100px"
                />
              </div>
            )}
          </div>
        </div>

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
