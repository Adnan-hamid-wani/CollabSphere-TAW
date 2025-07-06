import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response): Promise<Response> => {
  const { email, username, password, role } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(400).json({ message: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      role: role || "USER",
    },
  });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

  return res.status(201).json({
    message: "User registered",
    user: { id: user.id, email: user.email, username: user.username, role: user.role },
    token,
  });
};

export const login = async (req: Request, res: Response) => {
  console.log('LOGIN BODY:', req.body);

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  console.log("User from DB:", user); // ✅ log user

  if (!user) return res.status(400).json({ message: 'User not found' });

  const validPassword = await bcrypt.compare(password, user.password);
  console.log("Password match:", validPassword); // ✅ log match result

  if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  return res.json({ token, user });
};

