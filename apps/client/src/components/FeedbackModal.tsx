import { useState } from 'react';
import API from '../utils/api';
import { useTaskStore } from '../store/taskStore';

export const FeedbackModal = ({
  isOpen,
  close,
  taskId,
  approve,
}: {
  isOpen: boolean;
  close: () => void;
  taskId: string;
  approve: boolean;
}) => {
  const [feedback, setFeedback] = useState('');
  const { fetchTasks } = useTaskStore();

  const handleSubmit = async () => {
    const url = `/tasks/${taskId}/${approve ? 'approve' : 'reject'}`;
    await API.put(url, { feedback });
    fetchTasks();
    close();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{approve ? 'Approve' : 'Reject'} Task</h2>
        <textarea className="w-full border p-2 mb-2" placeholder="Feedback (optional)" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
        <div className="flex justify-end gap-2">
          <button className="bg-gray-400 text-white px-4 py-2" onClick={close}>Cancel</button>
          <button className="bg-blue-600 text-white px-4 py-2" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};
