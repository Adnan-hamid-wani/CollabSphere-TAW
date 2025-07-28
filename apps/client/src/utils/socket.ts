// src/utils/socket.ts
import { io, Socket } from "socket.io-client";
import { useNotificationStore } from "../store/notificationStore";

let socket: Socket | null = null;

export const initializeSocket = () => {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");

  if (!auth?.user?.id || !auth?.user?.role) {
    console.warn("User not ready, socket not initialized");
    return;
  }

  socket = io(import.meta.env.VITE_API_URL, {
    autoConnect: true,
    withCredentials: true,
    transports: ["websocket"],
    query: {
      userId: auth.user.id,
      role: auth.user.role,
    },
  });

  socket.on("notification", (data) => {
    const message = typeof data === "string" ? data : data?.message;
    if (message) {
      useNotificationStore.getState().addNotification(message);
    }
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected");
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err.message);
  });
};

export const getSocket = () => socket;

// ✅ Default export: fallback so old code using `import socket from ...` works
const fallbackSocket: Partial<Socket> = {
  emit: (...args) => {
    console.warn("⚠️ Tried to emit on socket before it's connected:", args);
  },
};

export default new Proxy(fallbackSocket, {
  get(target, prop) {
    if (socket) return (socket as any)[prop];
    return (target as any)[prop];
  },
});
