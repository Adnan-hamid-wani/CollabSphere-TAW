// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import TaskColumn from '../components/taskColumn';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { EditTaskModal } from '../components/EditTaskModal';
import { useModal } from '../hooks/useModal';
import { useAuthStore } from '../store/authStore';
import { TaskType } from '../types';
import socket from "../utils/socket";
import { toast } from "sonner"; // or any other toast lib
import NotificationBell from '../components/NotificationBell';

import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { columns, fetchTasks } = useTaskStore();
  const createModal = useModal();
  const { user } = useAuthStore();
  const { logout } = useAuthStore();
const navigate = useNavigate();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskType | null>(null);

  
  const handleLogout = () => {
    logout();
    navigate("/login");

  }
  const openEditModal = (task: TaskType) => {
    setTaskToEdit(task);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setTaskToEdit(null);
    setEditModalOpen(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  

  
useEffect(() => {
  socket.on("task-created", (task) => {
  useTaskStore.getState().fetchTasks(); // Always accurate

    toast.message("📌 New Task Assigned", {
      description: task.title,
    });
  });


  socket.on("task-deleted", (taskId) => {
    useTaskStore.getState().deleteTask(taskId);
    toast.success("Task Deleted");
  });


  socket.on("task-updated", (task) => {
    useTaskStore.getState().updateTask(task);
      useTaskStore.getState().fetchTasks(); // <-- fallback refresh

    toast.success("Task Updated");
  });


  socket.on("task-approved", (task) => {
    useTaskStore.getState().updateTask(task);
      useTaskStore.getState().fetchTasks(); // <-- fallback refresh

    toast.success("Task Approved");
  });


  socket.on("task-rejected", (task) => {
    useTaskStore.getState().updateTask(task);
      useTaskStore.getState().fetchTasks(); // <-- fallback refresh

    toast.success("Task Rejected");
  });

  socket.on("task-completed", (task) => {
    useTaskStore.getState().updateTask(task);
      useTaskStore.getState().fetchTasks(); // <-- fallback refresh

    toast.success("Task Completed");
  });
 

  return () => {
    socket.off("task-created");
    socket.off("task-updated");
    socket.off("task-deleted");
    socket.off("task-approved");
    socket.off("task-rejected");
    socket.off("task-completed");
  };
  
}, []);





  return (
<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-[#ffffff] p-6   ">
      {/* Header */}
      <div className=" items-center justify-between mb-6">
        
<div className='flex items-center justify-between'>
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">📋 CollabSphere</h2>
<p className="text-gray-800 mt-2 ml-5 text-xl capitalize">
  Welcomes you <b className="text-2xl text-blue-700">{user?.username || 'Guest'}</b>
</p>
                 <NotificationBell  />

        <button
  onClick={handleLogout}
  className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition  "
>
  Logout
</button>
</div>
        

        {user?.role === 'ADMIN' && (
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition mt-8"
            onClick={createModal.open}
          >
            + Create Task
          </button>

          
        )}
        
                         



                  

      </div>


      {/* Create Task Modal */}
      {createModal.isOpen && <CreateTaskModal onClose={createModal.close} />}

      {/* Task Columns */}
      <div className="flex flex-col lg:flex-row gap-6">
        {columns.map((col) => (
          <TaskColumn key={col.status} title={col.status} tasks={col.tasks} onEdit={openEditModal} />
        ))}
      </div>

      {/* Edit Task Modal */}
      {editModalOpen && taskToEdit && (
        <EditTaskModal isOpen={editModalOpen} close={closeEditModal} task={taskToEdit} />
      )}
    </div>
  );
};

export default Dashboard;
