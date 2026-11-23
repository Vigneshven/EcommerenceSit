import { Router } from "express";
import { guestSession } from "../middleware/guestSession";
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCart,
} from "../controllers/cartController";
import { guestCsrf } from "../middleware/guestCsrf";

const router = Router();

router.get("/", guestSession, guestCsrf, getCart);
router.post("/", guestSession, guestCsrf, addToCart);
router.put("/:cartItemId", guestSession, guestCsrf, updateCart);
router.delete("/:cartItemId", guestSession, guestCsrf, removeCartItem);

export default router;
