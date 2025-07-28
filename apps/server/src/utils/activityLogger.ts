import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const logActivity = async (
  taskId: string,
  actorId: string,
  action: string,
  message: string,
  io?: any
) => {
  const activity = await prisma.taskActivity.create({
    data: {
      taskId,
      actorId,
      action,
      message,
    },
    include: {
      actor: { select: { id: true, username: true } }, // ✅ add `id` here
      task: { select: { title: true, assignedTo: true } },
    },
  });

  if (io) {
    const assignedUserId = activity.task.assignedTo;

    if (assignedUserId && assignedUserId !== actorId) {
      io.to(assignedUserId).emit("activity-log", activity);
    }

    io.to(actorId).emit("activity-log", activity);
    io.to("admin").emit("activity-log", activity);
  }

  return activity;
};
