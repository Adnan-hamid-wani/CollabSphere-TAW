import { create } from 'zustand';
import API from '../utils/api';
import socket from '../utils/socket'; // 👈 socket client instance
import { Message } from '../types';

interface ChatStore {
  messages: Message[];
  currentReceiver: string | null;
  addMessage: (message: Message) => void;
  setCurrentReceiver: (userId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  fetchMessages: () => Promise<void>;
  sendFile: (file: File) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  currentReceiver: null,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setCurrentReceiver: (userId) => {
    set({ currentReceiver: userId, messages: [] }); // Reset messages
    get().fetchMessages(); // Fetch messages with new receiver
  },

  fetchMessages: async () => {
    const { currentReceiver } = get();
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    if (!currentReceiver) return;

    try {
      const res = await API.get(`/messages/${currentReceiver}`);
      set({ messages: res.data });
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  },

  sendMessage: async (content) => {
  const { currentReceiver } = get();
  const auth = JSON.parse(localStorage.getItem('auth') || '{}');
  if (!content.trim() || !currentReceiver) return;

  try {
    const response = await API.post('/messages', {
      senderId: auth.user.id,
      receiverId: currentReceiver,
      content,
      type: 'TEXT'
    });

    // ❌ Don't add message manually here
    // get().addMessage(response.data);

    socket.emit("sendMessage", response.data);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
},


  sendFile: async (file: File) => {
  const { currentReceiver } = get();
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  if (!file || !currentReceiver) return;

  try {
    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await API.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const { fileUrl } = uploadRes.data;
    const fileType = file.type;

    // Determine message type
    let type: "IMAGE" | "DOCUMENT" = "DOCUMENT";
    if (fileType.startsWith("image/")) {
      type = "IMAGE";
    }

    const response = await API.post("/messages", {
      senderId: auth.user.id,
      receiverId: currentReceiver,
      type,
      fileUrl,
      fileName: file.name,
      fileType: file.type,
      status: "SENT",
    });

    socket.emit("sendMessage", response.data);
  } catch (error) {
    console.error("Failed to upload and send file:", error);
  }
  }
}));