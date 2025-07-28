import { Router } from "express";
import { sendMessage} from "../controllers/message.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { getMessages } from "../controllers/message.controller";

const router = Router();

// file storage setup for multer

router.use((req, res, next) => {
  Promise.resolve(authenticate(req, res, next)).catch(next);
});

router.get("/:receiverId", getMessages); // ✅ secure the route

router.post("/", (req, res) => {
  sendMessage(req, res);
});



export default router;
