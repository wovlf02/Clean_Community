import { Socket } from 'socket.io';

// User information from JWT
export interface UserPayload {
  id: string;
  email: string;
  nickname: string;
}

// Extended Socket with user info
export interface AuthenticatedSocket extends Socket {
  user?: UserPayload;
}

// Message types
export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderNickname: string;
  content: string;
  type: 'text' | 'image' | 'system';
  createdAt: string;
  emotionLabel?: string;
}

// Room events
export interface JoinRoomPayload {
  roomId: string;
}

export interface LeaveRoomPayload {
  roomId: string;
}

// Message events
export interface SendMessagePayload {
  roomId: string;
  content: string;
  type?: 'text' | 'image';
}

export interface TypingPayload {
  roomId: string;
  isTyping: boolean;
}

export interface ReadMessagePayload {
  roomId: string;
  messageId: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'message' | 'friend_request' | 'like' | 'comment' | 'system';
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

// Presence types
export interface PresenceUpdate {
  userId: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

// Server to Client events
export interface ServerToClientEvents {
  // Chat events
  message: (message: ChatMessage) => void;
  message_sent: (data: { success: boolean; messageId: string }) => void;
  typing: (data: { userId: string; nickname: string; isTyping: boolean }) => void;
  user_joined: (data: { userId: string; nickname: string }) => void;
  user_left: (data: { userId: string; nickname: string }) => void;
  message_read: (data: { userId: string; messageId: string; unreadCount?: number }) => void;

  // Notification events
  notification: (notification: Notification) => void;

  // Presence events
  presence_update: (update: PresenceUpdate) => void;

  // Error events
  error: (error: { code: string; message: string }) => void;
}

// Client to Server events
export interface ClientToServerEvents {
  // Chat events
  join_room: (payload: JoinRoomPayload) => void;
  leave_room: (payload: LeaveRoomPayload) => void;
  send_message: (payload: SendMessagePayload) => void;
  typing: (payload: TypingPayload) => void;
  read_message: (payload: ReadMessagePayload) => void;

  // Presence events
  update_presence: (status: 'online' | 'away') => void;
}

// Inter-server events (for Redis adapter)
export interface InterServerEvents {
  ping: () => void;
}

// Socket data
export interface SocketData {
  user: UserPayload;
  rooms: Set<string>;
}
