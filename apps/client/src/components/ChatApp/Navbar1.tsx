import { useChatStore } from '../../store/chatStore';
import { useUserListStore } from '../../store/useUserListStore';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';
import { Phone, Video, MoreVertical, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Navbar1() {
  const { currentReceiver } = useChatStore(); // this is userId (string)
  const { users } = useUserListStore(); // list of all users
  const { user } = useAuthStore();
  const [showProfile, setShowProfile] = useState(false);

  const receiver = users.find((u) => u.id === currentReceiver); // ✅ get full object

  const modalRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setShowProfile(false);
    }
  };

  if (showProfile) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showProfile]);


  if (!receiver) return null;



  return (
    <>
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${receiver.username}`}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <p className="text-sm font-semibold">{receiver.username}</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-black-600 hover:text-blue-500 no-dark-mode">
            <Phone size={20} />
          </button>
          <button className="text-black-600 hover:text-blue-500 no-dark-mode">
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

      {/* Profile modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 no-dark-mode">
          <div className="bg-white w-[300px] p-5 rounded-lg shadow-xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 no-dark-mode"
              onClick={() => setShowProfile(false)}
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center no-dark-mode">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${receiver.username}`}
                className="w-20 h-20 rounded-full mb-4"
              />
              <h2 className="text-lg font-semibold">{receiver.username}</h2>
              <p className="text-sm text-gray-600 mb-4">
                {receiver.email || "No email"}
              </p>

              {user?.id !== receiver.id && (
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
      <div
  ref={modalRef}
>
</div>
    </>
  );
}
