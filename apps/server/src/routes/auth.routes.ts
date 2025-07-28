import { Router } from "express";
import { register, login , forgotPassword, resetPassword} from "../controllers/auth.controller";


const router = Router();

router.post("/register", (req, res, next) => {
  Promise.resolve(register(req, res)).catch(next);
});
router.post("/login", (req, res, next) => {
  Promise.resolve(login(req, res)).catch(next);
});

router.post("/forgot-password", (req, res, next) => {
  Promise.resolve(forgotPassword(req, res)).catch(next);
});

router.post("/reset-password", (req, res, next) => {
  Promise.resolve(resetPassword(req, res)).catch(next);
});

export default router;
