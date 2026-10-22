import { Router } from "express";
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCart,
} from "../controllers/cartController";

const router = Router();

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:cartItemId", updateCart);
router.delete("/:cartItemId", removeCartItem);

export default router;
