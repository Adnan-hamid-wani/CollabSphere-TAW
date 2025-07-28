import { Request, Response } from "express";
import prisma from "../prism";

// 👇 Extend Express to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
        role: string;
      };
    }
  }
}
// senderId + receiverId → last notified timestamp
const lastNotificationMap = new Map<string, number>();
const NOTIFY_COOLDOWN_MS = 10000; // 10 seconds, adjust as needed


export const sendMessage = async (req: Request, res: Response) => {
  try {
    const {
      senderId,
      receiverId,
      content,
      type,
      fileUrl,
      fileName,
      fileType,
      status = "SENT",
    } = req.body;

    if (!senderId || !receiverId || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const user = await prisma.user.findUnique({
  where: { id: req.user?.id },
});

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        type,
        fileUrl,
        fileName,
        fileType,
        status,
      },
    });
    const io = req.app.get("io");
    io.to(receiverId).emit("newMessage", message);
    io.to(senderId).emit("newMessage", message);

    // Emit notification to receiver
   const key = `${senderId}_${receiverId}`;
const now = Date.now();
const lastNotified = lastNotificationMap.get(key) || 0;


if (now - lastNotified > NOTIFY_COOLDOWN_MS) {
  io.to(receiverId).emit("notification", {
    message: `New messages from ${user?.username || "someone"}`,
  });
  lastNotificationMap.set(key, now);
}
   


    res.status(201).json(message);
  } catch (err) {
    console.error("Message creation failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};



// GET /messages/:receiverId
export const getMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // From JWT middleware
    const { receiverId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

