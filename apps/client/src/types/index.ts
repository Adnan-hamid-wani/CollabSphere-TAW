export type TaskStatus = 'TODO' | 'REJECTED'  | 'COMPLETED';

// Example TaskType definition
export type TaskType = {
  id: string;
  title: string;
  description: string;
  assignedUser?: {
    id: string;
    username: string;
  };
  status: string;
    submittedForReview?: boolean;
      approvedAt?: string | null;
      createdAt: string;
        feedback?: string;



  // ...other fields
};

export type ColumnType = {
  status: TaskStatus;
  tasks: TaskType[];
};
