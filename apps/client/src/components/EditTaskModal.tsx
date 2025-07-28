import { useEffect, useState } from "react";
import API from "../utils/api";
import { TaskType } from "../types";
import { useTaskStore } from "../store/taskStore";
import { toast } from "sonner";

export const EditTaskModal = ({
  isOpen,
  close,
  task,
}: {
  isOpen: boolean;
  close: () => void;
  task: TaskType;
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
 const [priority, setPriority] = useState<TaskType['priority']>(task.priority || "MEDIUM");
   const { fetchTasks } = useTaskStore();





  useEffect(() => {
    if (isOpen) {
       setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority || "MEDIUM");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen ,task]);

  const handleUpdate = async () => {
    try {
      await API.put(`/tasks/${task.id}`, { title, description, priority });
      close();
      fetchTasks();
    } catch (err) {
      console.error("Failed to update task", err);
      toast.error("Update failed.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white/50 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-6 relative">
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">✏️ Edit Task</h2>

        {/* Title input */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70"
        />

        {/* Description input */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70 resize-none"
          rows={4}
        />
      <select
  value={priority}
          onChange={(e) => setPriority(e.target.value as TaskType['priority'])}
  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg bg-white/70 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
>
  <option value="LOW">Low Priority</option>
  <option value="MEDIUM">Medium Priority</option>
  <option value="HIGH">High Priority</option>
</select>

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={close}
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};
