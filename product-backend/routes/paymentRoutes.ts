import { Router } from "express";
// import express from "express";
import { requireAuth } from "../middleware/requireAuth";
import { createPaymentCheckout } from "../controllers/paymentContoller";
import { guestSession } from "../middleware/guestSession";
import { guestCsrf } from "../middleware/guestCsrf";
// import { stripeWebHook } from "../controllers/stripeWebHookController";

const router = Router();

// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   stripeWebHook,
// );

router.post("/checkout", requireAuth, createPaymentCheckout);

router.post("/guest/checkout", guestSession, guestCsrf, createPaymentCheckout);

export default router;
