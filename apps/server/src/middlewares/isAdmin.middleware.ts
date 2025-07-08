import { RequestHandler } from "express";
import { AuthRequest } from "./auth.middleware";

export const isAdmin: RequestHandler = (req, res, next) => {
  const user = (req as AuthRequest).user;

  if (user?.role !== "ADMIN") {
    res.status(403).json({ message: "Only admins allowed" }); // ✅ no return needed
    return;
  }

  next();
};
