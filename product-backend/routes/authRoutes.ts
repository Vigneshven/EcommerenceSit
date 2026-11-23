import { Router } from "express";
import {
  guestMode,
  login,
  logout,
  register,
} from "../controllers/authController";
import { requireAuth } from "../middleware/requireAuth";
const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", requireAuth, (req, res) => {
  return res.status(200).json({
    message: "Authentication successfull",
    userId: req.userId,
  });
});

router.post("/logout", logout);
router.post("/guest", guestMode);

export default router;
