import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { currentUser } from '@/mocks/users';

interface RegisterData {
  email: string;
  password: string;
  nickname: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: RegisterData) => Promise<boolean>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });

        // Mock 로그인 (1초 딜레이)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (email === 'test@example.com' && password === 'password123') {
          set({ user: currentUser, isAuthenticated: true, isLoading: false });
          return true;
        }

        set({ isLoading: false });
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      register: async (data) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock 회원가입 성공
        const newUser: User = {
          id: `user-${Date.now()}`,
          ...data,
          image: undefined,
          bio: '',
          isOnline: true,
          createdAt: new Date().toISOString(),
        };

        set({ user: newUser, isAuthenticated: true, isLoading: false });
        return true;
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
