import { useAuthStore } from '../store/authStore';
import API from '../utils/api';
import { TaskType } from '../types';
import { useTaskStore } from '../store/taskStore';
import { useModal } from '../hooks/useModal';
import { FeedbackModal } from './FeedbackModal';
import { useState } from 'react';
import { toast } from 'sonner';

const TaskCard = ({
  task,
  onEdit,
}: {
  task: TaskType;
  onEdit: () => void;
}) => {
  const { user } = useAuthStore();
  const { fetchTasks } = useTaskStore();
  const feedbackModal = useModal();
  const rejectModal = useModal();
  const [isCompleting, setIsCompleting] = useState(false);
const [showFeedback, setShowFeedback] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const isOwner = user?.id === task?.assignedUser?.id;

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await API.put(`/tasks/${task.id}/complete`);
      await fetchTasks();
      toast.message('Task submitted!', {
        description: 'Your task was sent to admin for approval.',
        icon: '✅',
      });
    } catch (err) {
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
      } catch (err) {
        console.error("Error deleting task:", err);
        toast.error("Failed to delete task.");
      }
    }
  };

  return (
    <div className="relative bg-white/60 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl p-6 mb-6 transition hover:shadow-2xl">
      {/* Admin Edit/Delete Top-Right */}
      {isAdmin && (
        <div className="absolute top-4 right-4 flex gap-2">
          {['TODO', 'REJECTED'].includes(task.status) && (
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-900 mb-1">{task.title}</h3>
      <p className="text-sm text-gray-700 mb-3">{task.description}</p>

      <div className="text-xs text-gray-500 mb-4 space-y-1">
        <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
        {task.approvedAt && (
          <p className="text-green-600 font-medium">
            Approved: {new Date(task.approvedAt).toLocaleString()}
          </p>
        )}
        {task.assignedUser && (
          <p>
            Assigned to:{' '}
            <span className="font-semibold text-gray-800">
              {task.assignedUser.username}
            </span>
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        {isAdmin && task.status === 'TODO' && task.submittedForReview && (
          <>
            <button
              className="bg-green-100 text-green-700 px-4 py-1.5 text-sm rounded-full hover:bg-green-200 transition"
              onClick={feedbackModal.open}
            >
              Approve
            </button>
            <button
              className="bg-yellow-100 text-red-700 px-4 py-1.5 text-sm rounded-full hover:bg-yellow-200 transition"
              onClick={rejectModal.open}
            >
              Reject
            </button>
          </>
        )}

        {isOwner && task.status === 'TODO' && !task.submittedForReview && (
          <button
            className="bg-purple-100 text-purple-700 px-4 py-1.5 text-sm rounded-full hover:bg-purple-200 transition"
            onClick={handleComplete}
            disabled={isCompleting}
          >
            {isCompleting ? 'Submitting...' : 'Mark as Completed'}
          </button>
        )}

        {isOwner && task.status === 'TODO' && task.submittedForReview && (
          <span className="text-yellow-500 font-semibold text-sm">
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
  <>
    <button
      onClick={() => setShowFeedback(prev => !prev)}
      className="text-sm text-blue-500 font-semibold hover:text-blue-800  "
    >
      {showFeedback ? 'Hide Feedback ' : 'View Feedback 👁️'}
    </button>

    {showFeedback && (
      <div className="mt-2 border-l-4 border-blue-400 bg-blue-50 px-4 py-2 rounded-md border-r-4  ">
        <p className="text-sm text-blue-900">{task.feedback}</p>
      </div>
    )}
  </>
)}
    </div>
  );
};

export default TaskCard;

