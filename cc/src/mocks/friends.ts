import type { Friend, FriendRequest } from '@/types/friend';
import { users } from './users';

export const friends: Friend[] = [
  {
    id: 'friend-1',
    userId: 'user-1',
    friendId: 'user-2',
    friend: users[1],
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'friend-2',
    userId: 'user-1',
    friendId: 'user-3',
    friend: users[2],
    createdAt: '2024-02-05T14:00:00Z',
  },
  {
    id: 'friend-3',
    userId: 'user-1',
    friendId: 'user-4',
    friend: users[3],
    createdAt: '2024-02-10T09:00:00Z',
  },
  {
    id: 'friend-4',
    userId: 'user-1',
    friendId: 'user-5',
    friend: users[4],
    createdAt: '2024-02-15T16:00:00Z',
  },
  {
    id: 'friend-5',
    userId: 'user-1',
    friendId: 'user-6',
    friend: users[5],
    createdAt: '2024-02-20T11:00:00Z',
  },
];

export const friendRequests: FriendRequest[] = [
  {
    id: 'request-1',
    senderId: 'user-7',
    sender: users[6],
    receiverId: 'user-1',
    status: 'pending',
    createdAt: '2024-03-18T10:00:00Z',
  },
  {
    id: 'request-2',
    senderId: 'user-8',
    sender: users[7],
    receiverId: 'user-1',
    status: 'pending',
    createdAt: '2024-03-19T14:00:00Z',
  },
  {
    id: 'request-3',
    senderId: 'user-9',
    sender: users[8],
    receiverId: 'user-1',
    status: 'pending',
    createdAt: '2024-03-20T09:00:00Z',
  },
];
