import { useEffect, useRef } from "react";
import { useChatStore } from "../../store/chatStore";

export default function MessageList() {
  const { messages, currentReceiver } = useChatStore();
  const auth = localStorage.getItem("auth");
  const userId = auth ? JSON.parse(auth)?.user?.id : null;

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const filteredMessages = messages.filter(
    (m) =>
      (m.senderId === currentReceiver && m.receiverId === userId) ||
      (m.senderId === userId && m.receiverId === currentReceiver)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessageContent = (message: any) => {
    if (message.type === "TEXT") {
      return <p>{message.content}</p>;
    }

    if (message.type === "IMAGE" && message.fileUrl) {
      return (
        <a
      href={`http://localhost:4000${message.fileUrl}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src={`http://localhost:4000${message.fileUrl}`}
        alt={message.fileName || "image"}
        className="max-w-[200px] rounded-md hover:opacity-90 cursor-pointer transition"
      />
    </a>
      );
    }

    if (message.type === "DOCUMENT" && message.fileUrl) {
      return (
        <a
 href={`http://localhost:4000${message.fileUrl}`}
           target="_blank"
          rel="noopener noreferrer"
          className="underline text-sm"
        >
          📎 {message.fileName || "Download File"}
        </a>
      );
    }

    return <p className="no-dark-mode text-red-500">Unsupported message type</p>;
  };

  return (
    <div className="p-4 space-y-2 overflow-y-auto h-full ">
      {filteredMessages.map((message, index) => {
        const isOwn = message.senderId === userId;
        const bubbleColor = isOwn
          ? "bg-pink-400 text-black no-dark-mode"
          : "bg-gray-200 text-gray-800 no-dark-mode";

        return (
          <div
            key={message.id || index}
            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${bubbleColor}`}
            >
              {!isOwn && message.senderUsername && (
                <p className="font-medium">{message.senderUsername}</p>
              )}

              {renderMessageContent(message)}

              <p className="text-xs opacity-70 mt-1">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                ✔✔
              </p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
