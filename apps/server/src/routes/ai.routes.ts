import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const router = express.Router();

router.post("/generate-task", (req: Request, res: Response, next: NextFunction) => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`;

  axios
    .post(
      url,
      {
        contents: [
          {
            parts: [
              {
                text: `Generate a JSON object with "title" and "description" for the task: ${prompt}`,
              },
            ],
          },
        ],
      }
    )
    .then((response) => {
      const textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      let parsed = {};
      try {
        parsed = JSON.parse(textResponse);
      } catch (e) {
        parsed = {
          title: prompt,
          description: textResponse,
        };
      }

      res.json(parsed);
    })
    .catch((err) => {
      console.error("Gemini API error:", err.response?.data || err.message);
      res.status(500).json({ error: "Failed to generate task" });
    });
});

export default router;
