import { io } from "socket.io-client";
import { useNotificationStore } from "../store/notificationStore";

const API_URL = import.meta.env.VITE_API_URL;

const auth = JSON.parse(localStorage.getItem("auth") || "{}");

const socket = io(API_URL, {
  autoConnect: true,
  withCredentials: true,
  transports: ["websocket"],
  query: {
    userId: auth?.user?.id,
    role: auth?.user?.role,
  },
});

socket.on("notification", (data) => {
  const message = typeof data === "string" ? data : data?.message;
  if (message) {
    useNotificationStore.getState().addNotification(message);
  }
});

export default socket;
