import { Request, Response } from "express";
import { sendNewTaskEmail } from "../utils/email";

export const sendTaskAssignmentEmail = async (req: Request, res: Response) => {
  const { assignedToEmail, taskName } = req.body;

  if (!assignedToEmail || !taskName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await sendNewTaskEmail(assignedToEmail, taskName);
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ message: "Failed to send email" });
  }
};
