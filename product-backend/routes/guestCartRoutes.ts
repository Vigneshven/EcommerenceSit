import { Router } from "express";
import { guestSession } from "../middleware/guestSession";
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCart,
} from "../controllers/cartController";

const router = Router();

router.get("/", guestSession, getCart);
router.post("/", guestSession, addToCart);
router.put("/:cartItemId", guestSession, updateCart);
router.delete("/:cartItemId", guestSession, removeCartItem);

export default router;
