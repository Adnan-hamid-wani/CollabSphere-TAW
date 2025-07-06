// store/notificationStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Notification = {
  id: string;
  message: string;
  createdAt: Date;
};

type NotificationState = {
  notifications: Notification[];
  addNotification: (message: string) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      addNotification: (message) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              id: crypto.randomUUID(),
              message,
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
      name: "collabsphere-notifications", // localStorage key
      partialize: (state) => ({ notifications: state.notifications }), // Only persist notifications
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          if (!item) return null;
          // revive createdAt as Date object
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
