import { Router } from "express";
import { EndGuestSession } from "../controllers/guestSessionController";
import { guestSessionLimiter } from "../middleware/rateLimit";

const router = Router();

router.delete("/sessions", guestSessionLimiter, EndGuestSession);

export default router;
