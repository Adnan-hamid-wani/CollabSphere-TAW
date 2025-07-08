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
      actor: { select: { username: true } },
      task: { select: { title: true, assignedTo: true } }, // 💡 include assigned user
    },
  });

  if (io) {
    const assignedUserId = activity.task.assignedTo;

    // 👇 Emit to the user assigned to the task
    if (assignedUserId && assignedUserId !== actorId) {
      io.to(assignedUserId).emit("activity-log", activity);
    }

    // 👇 Emit to the actor (admin or user)
    io.to(actorId).emit("activity-log", activity);

    // 👇 Emit to all admins
    io.to("admin").emit("activity-log", activity);
  }

  return activity;
};
