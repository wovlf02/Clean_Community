export interface User {
  id: string;
  email: string;
  nickname: string;
  name: string;
  image?: string;
  bio?: string;
  statusMessage?: string;
  isOnline: boolean;
  createdAt: string;
}
