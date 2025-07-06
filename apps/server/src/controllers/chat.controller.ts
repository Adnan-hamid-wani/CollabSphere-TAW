// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
// import { AuthRequest } from "../middlewares/auth.middleware";

// const prisma = new PrismaClient();

// export const getMessages = async (req: AuthRequest, res: Response) => {
//   const { receiverId } = req.params;
//   const userId = req.userId;

//   const messages = await prisma.message.findMany({
//     where: {
//       OR: [
//         { senderId: userId, receiverId },
//         { senderId: receiverId, receiverId: userId },
//       ],
//     },
//     orderBy: { createdAt: "asc" },
//   });

//   res.json(messages);
// };

// export const sendMessage = async (req: AuthRequest, res: Response) => {
//   const { receiverId, content } = req.body;
//   const senderId = req.userId;

//   const message = await prisma.message.create({
//     data: { senderId, receiverId, content },
//   });

//   res.status(201).json(message);
// };
