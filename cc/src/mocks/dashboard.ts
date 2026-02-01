export const dashboardStats = {
  totalPosts: 45,
  totalComments: 128,
  totalLikes: 312,
  totalMessages: 89,
};

export const weeklyActivity = [
  { day: '월', posts: 3, comments: 8 },
  { day: '화', posts: 2, comments: 5 },
  { day: '수', posts: 5, comments: 12 },
  { day: '목', posts: 1, comments: 3 },
  { day: '금', posts: 4, comments: 9 },
  { day: '토', posts: 6, comments: 15 },
  { day: '일', posts: 2, comments: 6 },
];

export interface Activity {
  id: string;
  type: 'post' | 'comment' | 'like' | 'friend';
  title: string;
  description: string;
  createdAt: string;
}

export const recentActivities: Activity[] = [
  {
    id: 'activity-1',
    type: 'post',
    title: '새 게시글을 작성했습니다',
    description: 'Next.js 15에서 App Router 사용하기',
    createdAt: '2024-03-20T14:30:00Z',
  },
  {
    id: 'activity-2',
    type: 'comment',
    title: '댓글을 작성했습니다',
    description: '정말 유용한 글이네요!',
    createdAt: '2024-03-20T13:00:00Z',
  },
  {
    id: 'activity-3',
    type: 'like',
    title: '게시글에 좋아요를 눌렀습니다',
    description: 'TypeScript 타입 가드 완벽 가이드',
    createdAt: '2024-03-20T11:30:00Z',
  },
  {
    id: 'activity-4',
    type: 'friend',
    title: '새로운 친구가 되었습니다',
    description: '김철수님과 친구가 되었습니다',
    createdAt: '2024-03-19T16:00:00Z',
  },
  {
    id: 'activity-5',
    type: 'comment',
    title: '댓글을 작성했습니다',
    description: '저도 같은 생각이에요!',
    createdAt: '2024-03-19T10:00:00Z',
  },
];
