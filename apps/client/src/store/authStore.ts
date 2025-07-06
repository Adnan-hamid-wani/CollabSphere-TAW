// src/store/authStore.ts
import { create } from 'zustand';
import API from '../utils/api';

type AuthState = {
  user: any;
  token: string | null;
  authInitialized: boolean;
  loadAuthFromStorage: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  authInitialized: false,

  loadAuthFromStorage: () => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const { token, user } = JSON.parse(stored);
      set({ token, user, authInitialized: true });
    } else {
      set({ authInitialized: true });
    }
  },

  login: async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { user, token } = res.data;
    localStorage.setItem('auth', JSON.stringify({ token, user }));
    set({ user, token });
  },

  register: async (username, email, password) => {
    const res = await API.post('/auth/register', { username, email, password });
    const { user, token } = res.data;
    localStorage.setItem('auth', JSON.stringify({ token, user }));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('auth');
    set({ user: null, token: null });
  },
}));
