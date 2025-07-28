import { create } from 'zustand';
import API from '../utils/api';
import { TaskType, ColumnType } from '../types';

export interface TaskState {
  columns: ColumnType[];
  fetchTasks: () => void;
  addTask: (task: TaskType) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (updatedTask: TaskType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
   statusFilter: string;
  assigneeFilter: string;
  setStatusFilter: (status: string) => void;
  setAssigneeFilter: (assignee: string) => void;
  // ...other methods
};
function taskExists(tasks: TaskType[], id: string) {
  return tasks.some((t) => t.id === id);
}


export const useTaskStore = create<TaskState>((set) => ({
  columns: [],

  fetchTasks: async () => {
    const res = await API.get('/tasks/columns');
    set({ columns: res.data });
  },
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  statusFilter: '',
  assigneeFilter: '',
  setStatusFilter: (status) => set({ statusFilter: status }),
  setAssigneeFilter: (assignee) => set({ assigneeFilter: assignee }),

  addTask: (task: TaskType) =>
  set((state) => {
    return {
      columns: state.columns.map((col) =>
        col.status === task.status
          ? {
              ...col,
              tasks: [...taskExists(col.tasks, task.id) ? col.tasks : [task], ...col.tasks],
            }
          : col
      ),
    };
  }),
updateTask: (updatedTask) =>
  set((state) => {
    const newColumns = state.columns.map((col) => {
      // Remove task from all columns first
      const filteredTasks = col.tasks.filter((t) => t.id !== updatedTask.id);

      // Then, if this is the correct column, add updated task
      const shouldAdd = col.status === updatedTask.status;
      return {
        ...col,
        tasks: shouldAdd ? [updatedTask, ...filteredTasks] : filteredTasks,
      };
    });

    return { columns: newColumns };
  }),

  
deleteTask: (taskId) => {
    set((state) => ({
      columns: state.columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((task) => task.id !== taskId),
      })),
    }));
  },
  


}));


