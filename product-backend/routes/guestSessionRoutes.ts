import { Router } from "express";
import { EndGuestSession } from "../controllers/guestSessionController";

const router = Router();

router.delete("/sessions", EndGuestSession);

export default router;
