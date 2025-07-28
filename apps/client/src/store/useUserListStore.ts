// src/store/userListStore.ts
import { create } from 'zustand';
import { User } from '../types';
import API from '../utils/api';

interface UserListState {
  users: User[];
  fetchUsers: () => Promise<void>;
}

export const useUserListStore = create<UserListState>((set) => ({
  users: [],
  fetchUsers: async () => {
    const res = await API.get('/users');
    set({ users: res.data });
  },
}));
