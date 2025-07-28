import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useModal } from "../hooks/useModal";
import CreateTaskModal from "./CreateTaskModal";
import { useEffect, useState, useMemo } from "react";
import NotificationBell from "./NotificationBell";
import NotificationCenter from "./TaskHistory";
import { useTaskStore } from "../store/taskStore";
import { debounce } from 'lodash';
import { Menu } from '@headlessui/react';
import { Plus } from "lucide-react";
import {DarkModeToggle} from '@adnanwani/universal-darkmode'
const Navbar = () => {
  const isOnAdminAnlytics = window.location.pathname === "/admin-analytics";
  const isOnChatApp = window.location.pathname === "/messages/text";
  const { user } = useAuthStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const createModal = useModal();
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const { columns } = useTaskStore();

  const assignees = useMemo(() => {
    const allTasks = columns.flatMap((col) => col.tasks);
    const map = new Map<string, { id: string; username: string; avatar?: string }>();
    allTasks.forEach((task) => {
      const user = task.assignedUser;
      if (user?.id && !map.has(user.id)) {
        map.set(user.id, {
          id: user.id,
          username: user.username,
          avatar: user.avatar || '',
        });
      }
    });
    return Array.from(map.values());
  }, [columns]);

  const { setStatusFilter, setAssigneeFilter } = useTaskStore();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setStatusFilter(e.target.value);
  };

  const { setSearchQuery } = useTaskStore();
  const searchQuery = useTaskStore((state) => state.searchQuery);
  const debouncedSetSearchQuery = useMemo(() => debounce(setSearchQuery, 200), [setSearchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchQuery(e.target.value);
  };

  useEffect(() => {
    return () => {
      debouncedSetSearchQuery.cancel();
    };
  }, [debouncedSetSearchQuery]);

  const handleClearFilters = () => {
    setSelectedStatus('');
    setSelectedAssignee('');
    setStatusFilter('');
    setAssigneeFilter('');
    setSearchQuery('');
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

return (
  <div className=" bg-white/60 backdrop-blur-lg border-b border-gray-200 shadow-md px-6 py-2 sticky top-0 z-50">
    {/* LOGOUT BUTTON - Top Right */}
    <DarkModeToggle/>
    <button
      onClick={handleLogout}
      className="no-dark-mode absolute top-3 right-4 text-sm px-3 py-1.5 bg-red-500 text-white rounded-full shadow-sm hover:bg-red-600 transition-all duration-200 flex items-center gap-1"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Logout
    </button>

    {/* ROW: Brand + Welcome + Filters + Actions */}
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
      {/* Branding & Welcome */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-indigo-800">CollabSphere</h2>
        <p className="text-sm text-gray-500 ">
          Welcome, <span className="no-dark-mode font-semibold text-indigo-600">{user?.username || "Guest"}</span>
        </p>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-2 justify-center">
        <input
          type="text"
          placeholder="Search..."
          defaultValue={searchQuery}
          onChange={handleSearch}
          className="w-36 sm:w-48 px-3 py-1.5 rounded-full border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          onChange={handleStatusChange}
          value={selectedStatus}
          className="px-3 py-1.5 rounded-full border border-gray-300 text-sm bg-white text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All Statuses</option>
          <option value="TODO">TODO</option>
          <option value="REJECTED">REJECTED</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
        <Menu as="div" className="relative">
          <Menu.Button className="px-3 py-1.5 rounded-full border border-gray-300 text-sm bg-white text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            {selectedAssignee ? `👤 ${selectedAssignee}` : "Assignee"}
          </Menu.Button>
          <Menu.Items className="absolute z-20 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-xl shadow-md ring-1 ring-black/5 focus:outline-none max-h-60 overflow-y-auto">
            <div className="p-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => {
                      setSelectedAssignee("");
                      setAssigneeFilter("");
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
                      active ? "bg-indigo-50 text-indigo-700" : "text-gray-800"
                    }`}
                  >
                    All Assignees
                  </button>
                )}
              </Menu.Item>
              {assignees.map((user) => (
                <Menu.Item key={user.id}>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        setSelectedAssignee(user.username);
                        setAssigneeFilter(user.username);
                      }}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${
                        active ? "bg-indigo-50 text-indigo-700" : "text-gray-800"
                      }`}
                    >
                      <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}`}
                        alt={user.username}
                        className="w-5 h-5 rounded-full"
                      />
                      {user.username}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Menu>
        <button
          onClick={handleClearFilters}
          className="text-xs px-3 py-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          ❌ Clear
        </button>
      </div>

      {/* Actions Section */}
      <div className="flex flex-wrap items-center gap-2 justify-center">
        {user?.role === "ADMIN" && (
          <button
            onClick={createModal.open}
            className=" no-dark-mode flex items-center px-4 py-1.5 rounded-full bg-indigo-600 text-white text-sm shadow hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4 "/>
             Task
          </button>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-1.5 rounded-full bg-blue-100 text-yellow-700 border border-indigo-300 text-sm hover:bg-indigo-200"
        >
          🔔 Logs
        </button>
        {isOnAdminAnlytics ? (
          <Link
            to="/"
            className="px-4 py-1.5 rounded-full bg-green-100 text-green-700 border border-green-300 text-sm hover:bg-green-200"
          >
            🏠 Dashboard
          </Link>
        ) : (
          <Link
            to="/admin-analytics"
            className="px-4 py-1.5 rounded-full bg-indigo-100 text-green-700 border border-indigo-300 text-sm hover:bg-indigo-200"
          >
            📊 Analytics
          </Link>
        )}
        {isOnChatApp ? (
          <Link
            to="/"
            className="px-4 py-1.5 rounded-full bg-green-100 text-green-700 border border-green-300 text-sm hover:bg-green-200"
          >
            🏠 Dashboard
          </Link>
        ) : (
          <Link
          to="/messages/text"
          className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-300 text-sm hover:bg-blue-200" 
        >
          📧 Messages
        </Link>
        )}
        
        <NotificationBell />
      </div>
    </div>

    {/* Modals */}
    {createModal.isOpen && <CreateTaskModal onClose={createModal.close} />}
    {open && (
      <div className="fixed top-20 right-4 z-50 w-[400px] max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-100 p-4">
        <NotificationCenter />
      </div>
    )}
  </div>
);


};

export default Navbar;