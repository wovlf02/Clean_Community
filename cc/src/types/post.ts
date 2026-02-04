import type { User } from './user';

export interface Post {
  id: string;
  authorId: string;
  author: User;
  title: string;
  content: string;
  category: PostCategory;
  thumbnailUrl?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  // 감정 분석 결과
  sentimentScore?: number; // -100 ~ +100 (레거시)
  sentimentLabel?: 'positive' | 'neutral' | 'negative' | 'warning';
  // AI 감정분석 예측 점수
  sentimentPredictions?: Record<string, number>;
}

export type PostCategory = 'general' | 'qna' | 'info' | 'daily';
