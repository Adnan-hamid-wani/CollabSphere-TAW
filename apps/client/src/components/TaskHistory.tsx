import { useEffect } from 'react';
import { useActivityLogStore } from '../store/taskHistoryStore';
import { useAuthStore } from '../store/authStore'; // ✅ Add this

const NotificationCenter = () => {
  const { logs, fetchLogs } = useActivityLogStore();
  const currentUser = useAuthStore((s) => s.user);


  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="">
      <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
        📜 Activity Logs
      </h2>

      {logs.length === 0 ? (
        <p className="text-gray-400 italic">No activity logs found.</p>
      ) : (
        <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scroll">
      {logs.map((log) => (
  <li
    key={log.id}
    className="bg-blue-50 border border-blue-200 rounded-xl p-3 hover:bg-blue-100 transition"
  >
    <div className="text-sm text-gray-800">
      <b className="no-dark-mode text-blue-700">
        {log.actor.id === currentUser?.id ? "YOU" : log.actor.username}
      </b>{" "}
      — {log.message}
    </div>
    <div className="text-xs text-gray-500 mt-1">
      Task: <span className="font-medium">{log.task.title}</span> •{" "}
      {new Date(log.createdAt).toLocaleString()}
    </div>
  </li>
))}


        </ul>
      )}
    </div>
  );
};

export default NotificationCenter;
