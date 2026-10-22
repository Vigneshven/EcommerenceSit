import { Router } from "express";
import { getOrders, placeOrder } from "../controllers/orderController";
const router = Router();

router.get("/", getOrders);
router.post("/", placeOrder);

export default router;
