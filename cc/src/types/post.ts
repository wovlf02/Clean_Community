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
  sentimentScore?: number; // -100 ~ +100
  sentimentLabel?: 'positive' | 'neutral' | 'negative' | 'warning';
}

export type PostCategory = 'general' | 'qna' | 'info' | 'daily';
