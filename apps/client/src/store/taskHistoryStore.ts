// src/store/activityLogStore.ts
import { create } from 'zustand';
import API from '../utils/api';
import socket from '../utils/socket';

type ActivityLog = {
  id: string;
  action: string;
  message: string;
  createdAt: string;
  actor: {   
    id: string;
    username: string
   };
  task: { title: string };
};

type ActivityStore = {
  logs: ActivityLog[];
  fetchLogs: () => Promise<void>;
};

export const useActivityLogStore = create<ActivityStore>((set) => {
  let initialized = false;

  return {
    logs: [],
    fetchLogs: async () => {
      const res = await API.get('/tasks/activity/logs');
      set({ logs: res.data });

      // ⛔ Prevent multiple socket listeners
      if (!initialized) {
        initialized = true;

        socket.on("activity-log", (newLog: ActivityLog) => {
          set((state) => ({
            logs: [newLog, ...state.logs],
          }));
        });
      }
    },
  };
});
