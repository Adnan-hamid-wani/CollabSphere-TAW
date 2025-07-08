import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";
import { logActivity } from "../utils/activityLogger"; // Assuming you have this utility for logging activities

const prisma = new PrismaClient();

// 1️⃣ Admin creates and assigns a task
export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, assignedToEmail } = req.body;

  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Only admins can create tasks" });
  }

  if (!assignedToEmail || !title) {
    return res.status(400).json({ message: "Title and assigned user's email are required" });
  }

  // 🔍 Find user by email
  const user = await prisma.user.findUnique({
    where: { email: assignedToEmail },
  });

if (!user) {
  return res.status(404).json({ message: "Assigned user not found" });
}

const task = await prisma.task.create({
  data: {
    title,
    description,
    assignedTo: user.id,
    createdBy: req.user.id,
    status: "TODO",
  },
});

await logActivity(
  task.id,
  req.user.id,
  "CREATED",
  `Task "${task.title}" created and assigned to ${user.username}`,
    req.app.get('io') // <-- pass Socket.IO

);

const io = req.app.get('io'); // Attach io in server.ts (we’ll do that next)

io.to(user.id).emit("task-created", task); // Send to assigned user
io.to("admin").emit("task-created", task); // Send to all admins
io.to(task.assignedTo).emit("notification", {
  message: `New Task Created: ${task.title} ${task.description}`,
});

  return res.status(201).json(task);
};


// 2️⃣ Admin can update a task
export const updateTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Only admins can update tasks" });
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
    },
  });
  await logActivity(
  task.id,
  req.user.id,
  "UPDATED",
  `Task "${task.title}" updated by Admin`,
    req.app.get('io') // <-- pass Socket.IO

);

  const io = req.app.get("io");
io.to(task.assignedTo).emit("task-updated", task);
io.to("admin").emit("task-updated", task);
// Optionally, you can emit a notification to the assigned user
io.to(task.assignedTo).emit("notification", {
  message: `Task Updated: ${task.title} ${task.description}`,
});


  return res.status(200).json(task);
};

// 3️⃣ Admin can delete a task
export const deleteTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Only admins can delete tasks" });
  }
  

  // Fetch the task before deleting to get assignedTo and id
  const task = await prisma.task.findUnique({ where: { id } });
if (!task) {
  return res.status(404).json({ message: "Task not found" });
}
await logActivity(
  task.id,
  req.user.id,
  "DELETED",
  `Task "${task.title}" was deleted`,
    req.app.get('io') // <-- pass Socket.IO

);


await prisma.task.delete({ where: { id } });


  
  const io = req.app.get("io");
  if (task) {
    io.to(task.assignedTo).emit("task-deleted", task.id);
    io.to("admin").emit("task-deleted", task.id);
    io.to(task.assignedTo).emit("notification", {
  message: `Task has been Deleted: Title: ${task.title} Description: ${task.description}`,
});
  }
  

  return res.status(200).json({ message: "Task deleted" });
  
};

// 4️⃣ User marks task as completed → status: REJECTED
export const markAsCompleted = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const task = await prisma.task.findUnique({ where: { id } });

  if (!task || task.assignedTo !== req.user?.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

 // Instead of updating status to "REJECTED", update only the flag
const updated = await prisma.task.update({
  where: { id },
  data: { submittedForReview: true }, 

  
});
await logActivity(
  task.id,
  req.user.id,
  "MARKED_COMPLETED",
  `Task "${task.title}" marked as completed by ${req.user.username}`,
    req.app.get('io') // <-- pass Socket.IO

);

const io = req.app.get("io");
io.to("admin").emit("task-completed", task, ); // They review it
io.to("admin").emit("notification", { message: `Task Completed by :${req.user.username}` });






  return res.status(200).json(updated);
};

// 5️⃣ Admin approves task → status: COMPLETED
export const approveTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Task ID is required" });
  }

  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Only admins can approve" });
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      status: "COMPLETED",
submittedForReview: false,
feedback: null,

    },
  });
  await logActivity(
  task.id,
  req.user.id,
  "APPROVED",
  `Task "${task.title}" approved by Admin`,
    req.app.get('io') // <-- pass Socket.IO

);

  const io = req.app.get("io");
io.to(task.assignedTo).emit("task-approved", task);
io.to("admin").emit("task-approved", task);
io.to(task.assignedTo).emit("notification", {
  message: `Task Approved: ${task.title} ${task.description}`
});


  return res.status(200).json(task);
};


// 6️⃣ Admin rejects task with feedback
export const rejectTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { feedback } = req.body;

  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Only admins can reject" });
  }

  if (!feedback) {
    return res.status(400).json({ message: "Feedback is required" });
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      status: "REJECTED", // or keep TODO if you prefer
feedback,
submittedForReview: false,

    },
  });
  await logActivity(
  task.id,
  req.user.id,
  "REJECTED",
  `Task "${task.title}" rejected with feedback: ${feedback}`,
    req.app.get('io') // <-- pass Socket.IO

);


    const io = req.app.get("io");
io.to(task.assignedTo).emit("task-rejected", task);
io.to("admin").emit("task-rejected", task);
io.to(task.assignedTo).emit("notification", {
  message: `Task Rejected: ${task.title} ${task.description}`,
});


  return res.status(200).json(task);
};

// 7️⃣ Fetch grouped by status
export const getAllColumnsWithTasks = async (req: AuthRequest, res: Response) => {
  const statuses = ["TODO", "REJECTED", "COMPLETED"];
  const userId = req.user?.id;
  const userRole = req.user?.role;

  const columns = await Promise.all(
  statuses.map(async (status) => {
    const tasks = await prisma.task.findMany({
      where: {
        status,
        ...(userRole !== "ADMIN" && { assignedTo: userId }),
      },
      include: {
        assignedUser: { select: { username: true, id: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { status, tasks };
  })
);


  return res.json(columns);
};


export const getAllTaskActivityLogs = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const role = req.user?.role;

  const logs = await prisma.taskActivity.findMany({
    where: role === 'ADMIN'
      ? {} // Admins see everything
      : { actorId: userId }, // Users see only their own actions
    include: {
      actor: { select: { username: true } },
      task: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return res.status(200).json(logs);
};
