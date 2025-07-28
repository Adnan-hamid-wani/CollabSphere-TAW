import { useState, useRef } from "react";
import { useChatStore } from "../../store/chatStore";

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentReceiver, sendMessage, sendFile } = useChatStore();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReceiver) return;

    if (file) {
      await sendFile(file);
      setFile(null);
    }

    if (message.trim()) {
      await sendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
        {file && (
  <div className="flex items-center space-x-2 text-sm mt-2">
    {file.type.startsWith("image/") ? (
      <img
        src={URL.createObjectURL(file)}
        alt={file.name}
        className="w-16 h-16 object-cover rounded-md"
      />
    ) : (
      <p className="truncate max-w-xs">📎 {file.name}</p>
    )}
    <button
      type="button"
      onClick={() => setFile(null)}
      className="text-red-500 hover:underline text-xs"
    >
      ❌ Remove
    </button>
  </div>
)}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="no-dark-mode bg-gray-300 px-3 rounded-lg"
        >
          📎
        </button>
        <button
          type="submit"
          className="no-dark-mode bg-pink-500 text-black px-4 py-2 rounded-lg hover:bg-pink-600"
        >
          Send
        </button>
      </div>
    </form>
  );
}
