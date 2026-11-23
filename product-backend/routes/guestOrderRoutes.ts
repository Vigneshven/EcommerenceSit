import { Router } from "express";
import { guestSession } from "../middleware/guestSession";
import { getOrders } from "../controllers/orderController";
import { guestCsrf } from "../middleware/guestCsrf"

const router = Router();

router.get("/", guestSession, guestCsrf, getOrders);

export default router;
