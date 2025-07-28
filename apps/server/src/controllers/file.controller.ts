import { Request, Response } from "express";

// Handles generic file uploads
export const uploadFile = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Return the file URL to be stored wherever needed
    const fileUrl = `/uploads/${file.filename}`;
    return res.status(200).json({ fileUrl });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ message: "File upload failed" });
  }
};
