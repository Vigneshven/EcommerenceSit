import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { createPaymentCheckout } from "../controllers/paymentContoller";
import { guestSession } from "../middleware/guestSession";
import { guestCsrf } from "../middleware/guestCsrf";

const router = Router();

router.post("/checkout", requireAuth, createPaymentCheckout);

router.post("/guest/checkout", guestSession, guestCsrf, createPaymentCheckout);

export default router;
