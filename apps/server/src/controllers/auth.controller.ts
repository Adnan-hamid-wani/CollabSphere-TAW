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


import crypto from "crypto";
import { sendResetPasswordEmail } from "../utils/email";

// 🔁 Forgot Password
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(400).json({ message: "No user found with this email" });

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // valid for 1 hour

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry,
    },
  });

  await sendResetPasswordEmail(email, token);

  return res.json({ message: "Reset link sent to email." });
};

// ✅ Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return res.json({ message: "Password reset successful!" });
};
