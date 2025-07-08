import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useModal } from "../hooks/useModal";
import CreateTaskModal from "./CreateTaskModal";
import { useState } from "react";
import NotificationBell from "./NotificationBell";
import NotificationCenter from "./TaskHistory";



const Navbar = () => {
const isOnAdminAnlytics = window.location.pathname === "/admin-analytics";

  const { user } = useAuthStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const createModal = useModal();
  const [open, setOpen] = useState(false);


  


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 ">
      <div>
        <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          📋 CollabSphere
        </h2>
        <p className="text-lg text-gray-700 mt-1 capitalize">
          Welcome,{" "}
          <b className="text-2xl text-blue-700">{user?.username || "Guest"}</b>
        </p>
      </div>
      {createModal.isOpen && <CreateTaskModal onClose={createModal.close} />}

      <div className="flex items-center gap-4 mt-4 lg:mt-0">
        {user?.role === "ADMIN" && (
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            onClick={createModal.open}
          >
            + Create Task
          </button>
        )}

        <button
          className="bg-blue-100 text-blue-700 border border-blue-400 px-4 py-2 rounded-md shadow-sm hover:bg-blue-200"
          onClick={() => setOpen(!open)}
        >
          🔔 Activity Logs

        </button>
              {open && (
        <div className="fixed top-20 right-4 z-50 w-[400px]">
          <NotificationCenter />
        </div>
      )}

<div>
        {isOnAdminAnlytics ? (
          <Link
            to="/"
            className="bg-green-100 text-green-700 border border-green-400 px-4 py-2 rounded-md shadow-sm hover:bg-green-200"
          >
            🏠 Dashboard
          </Link>
        ) : (
          <Link
            to="/admin-analytics"
            className="bg-blue-100 text-blue-700 border border-blue-400 px-4 py-2 rounded-md shadow-sm hover:bg-blue-200"
          >
            📊 Admin Analytics
          </Link>
        )}
      </div>
        <NotificationBell />
        {open && (
          <div className="fixed top-20 right-4 z-50 w-[400px] max-h-[90vh] overflow-y-auto"></div>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
