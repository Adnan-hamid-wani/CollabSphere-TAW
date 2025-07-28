// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import TaskColumn from '../components/taskColumn';
import { EditTaskModal } from '../components/EditTaskModal';
import { TaskType } from '../types';
import socket from "../utils/socket";
import { toast } from "sonner"; // or any other toast lib
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { columns, fetchTasks } = useTaskStore();


  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskType | null>(null);

  
 
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
<div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-white">
    <Navbar />
    
   
  {/* Task Columns */}
  <div className="flex flex-col lg:flex-row gap-6">
    {columns.map((col) => (
      <TaskColumn
        key={col.status}
        title={col.status}
        tasks={col.tasks}
        onEdit={openEditModal}
      />
    ))}
  </div>

  {/* Edit Task Modal */}
  {editModalOpen && taskToEdit && (
    <EditTaskModal
      isOpen={editModalOpen}
      close={closeEditModal}
      task={taskToEdit}
    />
  )}
</div>

  );
};

export default Dashboard;
