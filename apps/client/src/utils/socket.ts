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
