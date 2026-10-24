import { Router } from "express";
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCart,
} from "../controllers/cartController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.get("/", requireAuth, getCart);
router.post("/", requireAuth, addToCart);
router.put("/:cartItemId", requireAuth, updateCart);
router.delete("/:cartItemId", requireAuth, removeCartItem);

export default router;
