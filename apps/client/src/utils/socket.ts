import { io } from "socket.io-client";
import { useNotificationStore } from "../store/notificationStore";

const auth = JSON.parse(localStorage.getItem("auth") || "{}");

const socket = io("http://localhost:4000", {
  autoConnect: true,
  withCredentials: true,
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
