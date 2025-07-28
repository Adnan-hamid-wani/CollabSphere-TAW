import { useState, useEffect } from "react";
import API from "../utils/api";
import { toast } from "sonner";
import { useFileUploadStore } from "../store/useFileUploadStore";
import axios from "axios";

type User = {
  id: string;
  email: string;
};

export const CreateTaskModal = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedToEmail, setAssignedToEmail] = useState("");
  const [priority, setPriority] = useState("MEDIUM"); // 👈 NEW
  const [users, setUsers] = useState<User[]>([]);
  const { uploadFile, fileUrl, uploading } = useFileUploadStore();
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    try {
      await API.post("/tasks", {
        title,
        description,
        assignedToEmail,
        priority, // 👈 NEW
        attachmentUrl: fileUrl,
      });

      toast.message("Task Created!", {
        description: "Task created Successfully.",
        icon: "✅",
      });

      useFileUploadStore.getState().reset();
      onClose();
    } catch (err: any) {
      console.error(err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Failed to create task");
    }
     try {
          setLoading(true);
          await axios.post("http://localhost:4000/api/email/send-task-assignment", {
            assignedToEmail,
            taskName: title,
          });
          setAssignedToEmail("");
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Something went wrong");
        } finally {
          setLoading(false);
        }
  };

  return (
    <div className="z-50 flex items-center justify-center mt-2">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-6 relative mt-3">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          📝 Create New Task
        </h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/70"
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/70 resize-none"
          rows={4}
        />

        {/* User dropdown */}
        <select
          value={assignedToEmail}
          onChange={(e) => setAssignedToEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg bg-white/70 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Assign to...</option>
          {users.map((user) => (
            <option key={user.id} value={user.email}>
              {user.email}
            </option>
          ))}
        </select>

        {/* Priority dropdown */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg bg-white/70 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="LOW">Low Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="HIGH">High Priority</option>
        </select>

        {/* File upload */}
        <input
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
          }}
          className="border rounded p-2 w-full"
        />

        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        {fileUrl && (
          <p className="text-green-600 text-sm mt-2">
            ✅ File attached:{" "}
            <a href={fileUrl} target="_blank" className="underline">
              Preview
            </a>
          </p>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Create
          </button>
        </div>
      </div>
      
      
    </div>
  );
};

export default CreateTaskModal;
