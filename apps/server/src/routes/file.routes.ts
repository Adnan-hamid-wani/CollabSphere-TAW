import { Router } from "express";
import { uploadFile } from "../controllers/file.controller";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

// Protect the upload route
router.post(
  "/upload",
  upload.single("file"),
  (req, res, next) => {
	Promise.resolve(uploadFile(req, res)).catch(next);
  }
);

export default router;
