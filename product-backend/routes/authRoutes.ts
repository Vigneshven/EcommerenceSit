import { Router } from "express";
import {
  guestMode,
  login,
  logout,
  register,
} from "../controllers/authController";
import { requireAuth } from "../middleware/requireAuth";
import {
  guestSessionLimiter,
  loginLimiter,
  registerLimiter,
} from "../middleware/rateLimit";
const router = Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);

router.get("/me", requireAuth, (req, res) => {
  return res.status(200).json({
    message: "Authentication successfull",
    userId: req.userId,
  });
});

router.post("/logout", logout);
router.post("/guest", guestSessionLimiter, guestMode);

export default router;
