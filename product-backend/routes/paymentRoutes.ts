import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import {
  createPaymentCheckout,
  getPendingPayments,
} from "../controllers/paymentContoller";
import { guestSession } from "../middleware/guestSession";
import { guestCsrf } from "../middleware/guestCsrf";

const router = Router();

router.post("/checkout", requireAuth, createPaymentCheckout);
router.get("/pending", requireAuth, getPendingPayments);

router.post("/guest/checkout", guestSession, guestCsrf, createPaymentCheckout);
router.get("/guest/pending", guestSession, guestCsrf, getPendingPayments);

export default router;
