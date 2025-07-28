import { Router } from "express";
import { sendTaskAssignmentEmail } from "../controllers/email.controller";

const router = Router();

router.post("/send-task-assignment", (req, res, next) => {
  Promise.resolve(sendTaskAssignmentEmail(req, res)).catch(next);
});

export default router;
