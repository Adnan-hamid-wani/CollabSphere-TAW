import MessageList from '../ChatApp/MessageList';
import UserList from './UserList';
import MessageInput from './MessageInput';
import Navbar from '../Navbar';
import Navbar1 from "./Navbar1";
import { useEffect } from "react";
import socket from "../../utils/socket";
import { useChatStore } from "../../store/chatStore";

export default function ChatContainer() {
  const { currentReceiver, addMessage } = useChatStore();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    if (!auth?.user?.id) return;

    socket.emit("setup", { userId: auth.user.id });

    socket.on("newMessage", (message) => {
      const receiver = useChatStore.getState().currentReceiver;
      if (
        message.senderId === receiver ||
        message.receiverId === receiver
      ) {
        addMessage(message);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);


  return (
    <div className="flex flex-col h-screen">
      <Navbar />
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
      
      {/* Sidebar - UserList */}
      <div className="w-1/4 border-r border-gray-200 bg-white overflow-y-auto">
        <UserList />
      </div>
      <Navbar1 />

      {/* Chat Section */}
      <div className="flex flex-col w-3/4 h-full">
        {currentReceiver ? (
          <>
            <div className="flex-1 overflow-y-auto">
              <MessageList />

            </div>

            <MessageInput />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
