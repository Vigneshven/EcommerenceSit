import { Router } from "express";
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCart,
} from "../controllers/cartController";
import { requireAuth } from "../middleware/requireAuth";
import { cartLimiter } from "../middleware/rateLimit";

const router = Router();

router.get("/", requireAuth, getCart);
router.post("/", requireAuth, cartLimiter, addToCart);
router.put("/:cartItemId", requireAuth, cartLimiter, updateCart);
router.delete("/:cartItemId", requireAuth, cartLimiter, removeCartItem);

export default router;
