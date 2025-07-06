import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Only admins allowed" });
  }
  next();
};



