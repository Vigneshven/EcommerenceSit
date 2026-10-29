import { Router } from "express";
import { guestSession } from "../middleware/guestSession";
import { getOrders, placeOrder } from "../controllers/orderController";
import { guestCsrf } from "../middleware/guestCsrf";
import { orderLimiter } from "../middleware/rateLimit";

const router = Router();

router.get("/", guestSession, guestCsrf, getOrders);
router.post("/", guestSession, guestCsrf, orderLimiter, placeOrder);

export default router;
