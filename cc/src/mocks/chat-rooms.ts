import type { ChatRoom } from '@/types/chat';
import { users } from './users';
import { messages } from './messages';

export const chatRooms: ChatRoom[] = [
  {
    id: 'room-1',
    type: 'direct',
    participants: [users[0], users[1]],
    lastMessage: messages.find((m) => m.roomId === 'room-1'),
    unreadCount: 2,
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'room-2',
    type: 'direct',
    participants: [users[0], users[2]],
    lastMessage: messages.find((m) => m.roomId === 'room-2'),
    unreadCount: 0,
    createdAt: '2024-03-05T14:00:00Z',
  },
  {
    id: 'room-3',
    type: 'group',
    name: '개발 스터디 그룹',
    participants: [users[0], users[1], users[2], users[3], users[4]],
    lastMessage: messages.find((m) => m.roomId === 'room-3'),
    unreadCount: 5,
    createdAt: '2024-02-15T09:00:00Z',
  },
  {
    id: 'room-4',
    type: 'direct',
    participants: [users[0], users[5]],
    lastMessage: messages.find((m) => m.roomId === 'room-4'),
    unreadCount: 0,
    createdAt: '2024-03-10T16:00:00Z',
  },
  {
    id: 'room-5',
    type: 'group',
    name: 'Next.js 마스터',
    participants: [users[0], users[6], users[7], users[8]],
    lastMessage: messages.find((m) => m.roomId === 'room-5'),
    unreadCount: 3,
    createdAt: '2024-02-20T11:00:00Z',
  },
];
