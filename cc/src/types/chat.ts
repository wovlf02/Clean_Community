import type { User } from './user';

export interface ChatRoom {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  sender: User;
  content: string;
  type: 'text' | 'image' | 'emoji' | 'file';
  isRead: boolean;
  readBy?: string[]; // 읽은 사용자 ID 목록
  createdAt: string;
  // 파일/이미지 관련
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
}
