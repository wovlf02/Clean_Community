export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'friend_request' | 'message';
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}
