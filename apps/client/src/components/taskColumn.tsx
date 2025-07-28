import { useTaskStore } from '../store/taskStore';
import { TaskType } from '../types';
import TaskCard from './TaskCard';

type Props = {
  title: string;
  tasks: TaskType[];
  onEdit: (task: TaskType) => void;
};

const TaskColumn = ({ title, tasks, onEdit }: Props) => {
 const { searchQuery, statusFilter, assigneeFilter } = useTaskStore();

const filteredTasks = tasks.filter((task) => {
  const matchesSearch =
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesStatus =
    !statusFilter || task.status === statusFilter;

  const matchesAssignee =
    !assigneeFilter || task.assignedUser?.username.toLowerCase() === assigneeFilter.toLowerCase();

  return matchesSearch && matchesStatus && matchesAssignee;
});


  return (
    <div className="w-1/3 bg-blue-100 rounded p-4">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      {filteredTasks.length === 0 ? (
        <p className="text-gray-500 italic">No matching tasks</p>
      ) : (
        filteredTasks.map((task) => (
          <TaskCard
            key={`${task.id}-${task.status}-${task.submittedForReview}`}
            task={task}
            onEdit={() => onEdit(task)}
          />
        ))
      )}
    </div>
  );
};

export default TaskColumn;
