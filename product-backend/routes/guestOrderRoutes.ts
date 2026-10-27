import { Router } from "express";
import { guestSession } from "../middleware/guestSession";
import { getOrders, placeOrder } from "../controllers/orderController";

const router = Router();

router.get("/", guestSession, getOrders);
router.post("/", guestSession, placeOrder);

export default router;
