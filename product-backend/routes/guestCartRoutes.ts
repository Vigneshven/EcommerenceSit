import { Router } from "express";
import { guestSession } from "../middleware/guestSession";
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCart,
} from "../controllers/cartController";
import { guestCsrf } from "../middleware/guestCsrf";
import { cartLimiter } from "../middleware/rateLimit";

const router = Router();

router.get("/", guestSession, guestCsrf, getCart);
router.post("/", guestSession, guestCsrf, cartLimiter, addToCart);
router.put("/:cartItemId", guestSession, guestCsrf, cartLimiter, updateCart);
router.delete(
  "/:cartItemId",
  guestSession,
  guestCsrf,
  cartLimiter,
  removeCartItem,
);

export default router;
