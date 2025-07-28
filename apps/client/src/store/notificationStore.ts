// store/notificationStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Notification = {
  id: string;
  message: string;
  createdAt: Date;
  type: "message" | "task" | "other";
};

type NotificationState = {
  notifications: Notification[];
  addNotification: (message: string, type: "message" | "task" | "other") => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      addNotification: (message, type) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              id: crypto.randomUUID(),
              message,
              type,
              createdAt: new Date(),
            },
          ],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearAll: () => set({ notifications: [] }),
    }),
    {
      name: "collabsphere-notifications",
      partialize: (state) => ({ notifications: state.notifications }),
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          if (!item) return null;
          const parsed = JSON.parse(item);
          parsed.state.notifications = parsed.state.notifications.map((n: any) => ({
            ...n,
            createdAt: new Date(n.createdAt),
          }));
          return parsed;
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
