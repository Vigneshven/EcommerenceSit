import { Router } from "express";
import { getOrders } from "../controllers/orderController";
import { requireAuth } from "../middleware/requireAuth";
const router = Router();

router.get("/", requireAuth, getOrders);

export default router;
