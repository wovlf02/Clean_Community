import type { User } from './user';

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  parentId?: string;
  replies?: Comment[];
  isEdited: boolean;
  createdAt: string;
  // AI 감정분석 결과
  sentimentPredictions?: Record<string, number>;
}
