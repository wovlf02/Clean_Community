export interface User {
  id: string;
  email: string;
  nickname: string;
  name: string;
  image?: string;
  bio?: string;
  isOnline: boolean;
  createdAt: string;
}
