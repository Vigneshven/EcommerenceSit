import { Router } from "express";
import { getOrders, placeOrder } from "../controllers/orderController";
import { requireAuth } from "../middleware/requireAuth";
import { orderLimiter } from "../middleware/rateLimit";
const router = Router();

router.get("/", requireAuth, getOrders);
router.post("/", requireAuth, orderLimiter, placeOrder);

export default router;
