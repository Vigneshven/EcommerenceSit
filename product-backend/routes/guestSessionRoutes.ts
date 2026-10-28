import { Router } from "express";
import { guestSession } from "../middleware/guestSession";
import { guestCsrf } from "../middleware/guestCsrf";
import { EndGuestSession } from "../controllers/guestSessionController";

const router = Router();

router.delete(
  "/sessions",
  guestSession,
  guestCsrf,
  EndGuestSession,
);

export default router;
