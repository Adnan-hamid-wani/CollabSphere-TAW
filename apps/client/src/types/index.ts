export type TaskStatus = 'TODO' | 'REJECTED'  | 'COMPLETED';


export interface AITaskResponse {
  generated_text:string;

};
//    <nav className="bg-gradient-to-r from-black via-indigo-600 to-blue-200 text-white shadow-2xl">
export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskGenerated: (data: any) => void;
};
// Example TaskType definition
export type TaskType = {
  id: string;
  title: string;
  description: string;
  assignedUser?: {
    id: string;
    username: string;
    avatar?: string;
  };
  status: string;
    submittedForReview?: boolean;
      submittedAt?: string | null;
      createdAt: string;
        feedback?: string;
          attachmentUrl?: string;

  priority: 'low' | 'medium' | 'high';



  // ...other fields
};

export type ColumnType = {
  status: TaskStatus;
  tasks: TaskType[];
};
export type Message = {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: "TEXT" | "IMAGE" | "FILE";
  createdAt: string;
  senderUsername?: string; // Optional, to display sender's username
  senderAvatar?: string; // Optional, to display sender's avatar
  receiverUsername?: string; // Optional, to display receiver's username
  receiverAvatar?: string; // Optional, to display receiver's avatar
  readByReceiver?: boolean; // Optional, to track if the message was read by the receiver
  readBySender?: boolean; // Optional, to track if the message was read by the sender
  
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  avatar?: string;
  lastSeen?: string;
    username: string; // Add this line

};
