import { Request, Response } from "express";
import prisma from "../prism";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true, // ✅ Make sure this is selected
        avatar: true     // ✅ Optional if you're using avatars
      }
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
