import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../store/notificationStore";
import { useState , useEffect, useRef} from "react";
import { Bell } from "lucide-react";


export default function NotificationBell() {
  const { notifications, removeNotification, clearAll } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  if (open) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [open]);

  // 🔀 Get route from type
  const getRoute = (type: string) => {
    switch (type) {
      case "message":
        return "/";
      case "task":
        return "/";
      default:
        return "/messages/text/";
    }
  };

  return (
     <div
  ref={modalRef}
>
    
    <div className="ml-auto mr-20 relative">
    
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 hover:text-black transition"
      >
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="no-dark-mode absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 w-80 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg animate-fade-in">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
            {notifications.length > 0 && (
              <button
                className="no-dark-mode text-xs text-red-600 hover:underline"
                onClick={clearAll}
              >
                Clear All
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto p-2">
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No notifications</p>
            ) : (
              <ul className="space-y-2">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="flex items-start justify-between p-3 text-sm bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <span
                      className="text-gray-700 cursor-pointer hover:underline"
                      onClick={() => {
                        navigate(getRoute(n.type));
                        removeNotification(n.id);
                        setOpen(false);
                      }}
                    >
                      {n.message}
                    </span>
                    <button
                      className="no-dark-mode ml-3 text-blue-500 text-xs hover:underline"
                      onClick={() => removeNotification(n.id)}
                    >
                      Dismiss
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      )}
       
</div>

    </div>
  );
}
