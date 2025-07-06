// src/components/TaskColumn.tsx
import { TaskType } from '../types';
import TaskCard from './TaskCard';

type Props = {
  title: string;
  tasks: TaskType[];
  onEdit: (task: TaskType) => void;
};

const TaskColumn = ({ title, tasks, onEdit }: Props) => {
  return (
    <div className="w-1/3 bg-blue-100 rounded p-4  ">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      {tasks.map((task) => (
<TaskCard
  key={`${task.id}-${task.status}-${task.submittedForReview}`}
// optionally include feedback too if needed:
// key={`${task.id}-${task.status}-${task.submittedForReview}-${task.feedback ?? ''}`}
  task={task}
  onEdit={() => onEdit(task)}
/>      ))}
    </div>
  );
};

export default TaskColumn;
