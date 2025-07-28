import { useState } from "react";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";
import { Phone, Video, MoreVertical, X } from "lucide-react";



export default function Navbar1() {
  const { currentReceiver } = useChatStore();
  const { user } = useAuthStore(); // Logged-in user (self)
  const [showProfile, setShowProfile] = useState(false);

  if (!currentReceiver) return null;

  return (
    <>
      <div className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentReceiver.username}`}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">{currentReceiver?.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-gray-600 hover:text-blue-500">
            <Phone size={20} />
          </button>
          <button className="text-gray-600 hover:text-blue-500">
            <Video size={20} />
          </button>
          <button
            className="text-gray-600 hover:text-blue-500"
            onClick={() => setShowProfile(true)}
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Modal Popup */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[300px] p-5 rounded-lg shadow-xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => setShowProfile(false)}
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentReceiver.username}`}
                className="w-20 h-20 rounded-full mb-4"
              />
              <h2 className="text-lg font-semibold">{currentReceiver.username}</h2>
              <p className="text-sm text-gray-600 mb-4">
                {currentReceiver.email || "No email"}
              </p>

              {/* Example: show own vs. other */}
              {user?.id !== currentReceiver.id && (
                <>
                  <button className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1 rounded">
                    Block User
                  </button>
                  <button className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white py-1 rounded">
                    Report User
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
