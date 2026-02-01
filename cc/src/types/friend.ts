import type { User } from './user';

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friend: User;
  createdAt: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  sender: User;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}
