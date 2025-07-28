import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTaskAnalytics = async (req: Request, res: Response) => {
  try {
    // 🟡 Task Trends Over Time (Group by Date & Status)
    const rawTasks = await prisma.task.findMany({
      select: { createdAt: true, status: true },
    });

    const tasksOverTimeMap: Record<string, { todo: number; pending: number; completed: number }> = {};

    rawTasks.forEach((task) => {
      const date = task.createdAt.toISOString().split('T')[0];
      if (!tasksOverTimeMap[date]) {
        tasksOverTimeMap[date] = { todo: 0, pending: 0, completed: 0 };
      }
      const key = task.status.toLowerCase() as keyof typeof tasksOverTimeMap[string];
      if (tasksOverTimeMap[date][key] !== undefined) {
        tasksOverTimeMap[date][key]++;
      }
    });

    const tasksOverTime = Object.entries(tasksOverTimeMap).map(([date, counts]) => ({
      date,
      ...counts,
    }));

    // 🟢 Status Counts
    const statusCounts = await prisma.task.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const statusCountsWithTotals = statusCounts.map((s) => ({
      status: s.status,
      count: s._count.status,
    }));

    // 🔵 Performance per user
    // 🔵 Performance per user: completed, pending, rejected
const users = await prisma.user.findMany({ select: { id: true, username: true } });

const tasks = await prisma.task.findMany({
  select: {
    assignedTo: true,
    status: true,
  },
});

const userTaskMap: Record<
  string,
  { completed: number; pending: number; rejected: number }
> = {};

users.forEach((user) => {
  userTaskMap[user.id] = { completed: 0, pending: 0, rejected: 0 };
});

tasks.forEach((task) => {
  if (!task.assignedTo) return;

  const entry = userTaskMap[task.assignedTo];
  if (!entry) return;

  if (task.status === "COMPLETED") entry.completed++;
  else if (task.status === "PENDING") entry.pending++;
  else if (task.status === "REJECTED") entry.rejected++;
});

const performanceWithNames = users.map((user) => {
  const userData = userTaskMap[user.id] || { completed: 0, pending: 0, rejected: 0 };
  return {
    username: user.username,
    ...userData,
    total: userData.completed + userData.pending + userData.rejected,
  };
});


    // 🟣 Average Completion Time
    const completedActivities = await prisma.taskActivity.findMany({
      where: { action: "COMPLETED" },
      select: {
        createdAt: true,
        task: {
          select: { createdAt: true },
        },
      },
    });

    let averageHours = 0;
    let averageMinutes = 0;
   if (completedActivities.length > 0) {
  const totalMillis = completedActivities.reduce((sum, activity) => {
    const assignedAt = activity.task.createdAt;
    const completedAt = activity.createdAt;
    return sum + (completedAt.getTime() - assignedAt.getTime());
  }, 0);

  const avgMillis = totalMillis / completedActivities.length;
  averageHours = +(avgMillis / (1000 * 60 * 60)).toFixed(2); // in hours
  averageMinutes = +(avgMillis / (1000 * 60)).toFixed(2); // in minutes
}


    // 🔢 Totals
    const totalTasks = await prisma.task.count();
    const completed = await prisma.task.count({ where: { status: 'COMPLETED' } });
    const todoTasks = await prisma.task.count({ where: { status: 'TODO' } });
    const inProgressTasks = await prisma.task.count({ where: { status: 'IN_PROGRESS' } }); // Optional status

    const completionRate = totalTasks === 0 ? 0 : +((completed / totalTasks) * 100).toFixed(2);

    // 👥 User Metrics
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.task.groupBy({
      by: ['assignedTo'],
      _count: true,
    });

    // ✅ Final Response
    res.json({
      statusCounts: statusCountsWithTotals,
      performance: performanceWithNames,
      averageCompletionHours: averageHours,
        averageCompletionMinutes: averageMinutes,

      totalTasks,
      completionRate,
      pendingApprovals: todoTasks,
      todoTasks,
      inProgressTasks,
      totalUsers,
      activeUsers: activeUsers.length,
      tasksOverTime,
    });

  } catch (err) {
    console.error('Error in getTaskAnalytics:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
