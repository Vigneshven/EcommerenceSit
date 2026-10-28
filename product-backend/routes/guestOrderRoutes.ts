import { Router } from "express";
import { guestSession } from "../middleware/guestSession";
import { getOrders, placeOrder } from "../controllers/orderController";
import { guestCsrf } from "../middleware/guestCsrf";

const router = Router();

router.get("/", guestSession, guestCsrf, getOrders);
router.post("/", guestSession, guestCsrf, placeOrder);

export default router;
