import { Router } from "express";
import { razorpayWebHook } from "../controllers/paymentContoller";

const router = Router();

router.post("/webhook", razorpayWebHook);

export default router;
