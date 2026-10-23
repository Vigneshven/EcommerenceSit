import { Router } from "express";
import { getOrders, placeOrder } from "../controllers/orderController";
import { requireAuth } from "../middleware/requireAuth";
const router = Router();

router.get("/", requireAuth, getOrders);
router.post("/", requireAuth, placeOrder);

export default router;
