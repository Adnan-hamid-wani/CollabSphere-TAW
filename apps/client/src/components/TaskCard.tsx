import { useAuthStore } from "../store/authStore";
import API from "../utils/api";
import { TaskType } from "../types";
import { useTaskStore } from "../store/taskStore";
import { useModal } from "../hooks/useModal";
import { FeedbackModal } from "./FeedbackModal";
import { useState } from "react";
import { toast } from "sonner";
import { Edit3, Trash2 , Calendar , ArrowDown , ArrowUp, AlertCircle } from "lucide-react";
import { Eye, EyeOff } from 'lucide-react';
const TaskCard = ({ task, onEdit }: { task: TaskType; onEdit: () => void }) => {
  const { user } = useAuthStore();
  const { fetchTasks } = useTaskStore();
  const feedbackModal = useModal();
  const rejectModal = useModal();
  const [isCompleting, setIsCompleting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);


  const isAdmin = user?.role === "ADMIN";
  const isOwner = user?.id === task?.assignedUser?.id;

const priorityConfig = {
  low: {
    icon: ArrowDown,
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-300",
  },
  medium: {
    icon: AlertCircle,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
    border: "border-yellow-300",
  },
  high: {
    icon: ArrowUp,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-300",
  },
};


const priorityKey = task.priority.toLowerCase() as keyof typeof priorityConfig;
const { icon: PriorityIcon, color, bg, border } = priorityConfig[priorityKey] || {};

 
  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await API.put(`/tasks/${task.id}/complete`);
      await fetchTasks();
      toast.message("Task submitted!", {
        description: "Your task was sent to admin for approval.",
        icon: "✅",
      });
    } catch (err) {
      console.error("Error marking task complete:", err);
      toast.error("Failed to submit task for approval.");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await API.delete(`/tasks/${task.id}`);
        await fetchTasks();
        toast.warning("Task deleted.");
      } catch (err) {
        console.error("Error deleting task:", err);
        toast.error("Failed to delete task.");
      }
    }
  };

    const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
 

  return (
<div className={` relative  bg-white backdrop-blur-lg border ${border || "border-white/30"} shadow-2xl rounded-2xl p-6 mb-6  transition-all duration-300 ease-in-out transform hover:-translate-y-1
`}>
      {/* Admin Edit/Delete Top-Right */}



      {isAdmin && (
        <div className="absolute top-4 right-4 flex gap-2">
          {["TODO", "REJECTED"].includes(task.status) && (
            <button
              onClick={onEdit}
              className="no-dark-mode p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-100 rounded-lg transition-all duration-200"            >
              <Edit3 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleDelete}
              className="no-dark-mode p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
          >
              <Trash2 className="h-4 w-4" />
          </button>
        </div>
        
      )}
   
      <h3 className="text-xl font-semibold text-gray-900 mb-1 ">{task.title}</h3>
      <p className="text-sm text-gray-700 mb-3 ">{task.description}</p>

      <div className="text-xs text-gray-500 mb-4 space-y-1">
  <div className="flex items-center space-x-1">
    <Calendar className="h-3 w-3" />
    <span>
      {formatDate(task.createdAt)}
      {task.submittedAt && (
        <>
          {" "}-{" "}
          <span className="text-green-700 font-medium no-dark-mode">
            {formatDate(task.submittedAt)}
          </span>
        </>
      )}
    </span>
  </div>

        {task.assignedUser && (
          <p>
            Assigned to:{" "}
            <span className="font-semibold text-gray-800">
              {task.assignedUser.username}
            </span>
          </p>
        )}
      </div>
      {task.attachmentUrl && (
        <span className="no-dark-mode inline-flex items-center gap-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          📎{" "}
          <a
            href={`http://localhost:4000${task.attachmentUrl}`}
            target="_blank"
            rel="noreferrer"
          >
            Attachment
          </a>
        </span>
      )}
      <div className="mt-4  flex gap-2">
  <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${bg}`}>
    {PriorityIcon && <PriorityIcon className={`no-dark-mode h-3 w-3 ${color}`} />}
    <span className={`no-dark-mode text-xs font-small capitalize ${color}`}>
      {task.priority}
    </span>
  </div>
   
</div>

      <div className="flex flex-wrap  gap-3 bottom-[1.3rem] absolute right-4">
        {isAdmin && task.status === "TODO" && task.submittedForReview && (
          <>
            <button
              className=" no-dark-mode bg-green-100 text-green-700 px-4 py-1.5 text-sm rounded-full hover:bg-green-200 transition"
              onClick={feedbackModal.open}
            >
              Approve
            </button>
            <button
              className="no-dark-mode bg-yellow-100 text-red-700 px-4 py-1.5 text-sm rounded-full hover:bg-yellow-200 transition"
              onClick={rejectModal.open}
            >
              Reject
            </button>
          </>
        )}

        {isOwner && task.status === "TODO" && !task.submittedForReview && (
          <button
            className="no-dark-mode bg-purple-100 text-purple-700 px-4 py-1.5 text-sm rounded-full hover:bg-purple-200 transition"
            onClick={handleComplete}
            disabled={isCompleting}
          >
            {isCompleting ? "Submitting..." : "Mark as Completed"}
          </button>
        )}

        {isOwner && task.status === "TODO" && task.submittedForReview && (
          <span className="no-dark-mode text-yellow-500 font-semibold text-sm">
            ⏳ Pending Approval
          </span>
        )}
      </div>

      {/* Feedback Modals */}
      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        close={feedbackModal.close}
        taskId={task.id}
        approve={true}
      />
      <FeedbackModal
        isOpen={rejectModal.isOpen}
        close={rejectModal.close}
        taskId={task.id}
        approve={false}
      />
      {/* View Feedback Button if Feedback Exists */}
    {task.feedback && (
  <div className="">
    <button
      onClick={() => setShowFeedback((prev) => !prev)}
  className="no-dark-mode flex items-center  gap-1 text-sm text-blue-500 font-semibold hover:text-blue-800  ml-auto  relative transition-all duration-200"
    >
      {showFeedback ? "Hide Feedback" : "View Feedback"}
      {showFeedback ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </button>

    {showFeedback && (
      <div className="mt-1.5 border-l-4 border-blue-400 bg-blue-50 px-4 py-2 rounded-md border-r-4 ">
        <p className="text-sm text-black">{task.feedback}</p>
      </div>
    )}
  </div>
)}

      {/* Task Priority */}
    

    </div>
  );
};

export default TaskCard;
