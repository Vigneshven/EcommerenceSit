import type { Request, Response } from "express";
import {
  addCartItems as insertCartItem,
  getCartItems,
  updateCartItem as updateItem,
  deleteCartItem as deleteItem,
  type CartOwner,
} from "../models/cartModel";
import { randomUUID } from "node:crypto";

const GUEST_ID = randomUUID();

function getOwner(
  userId: number | undefined,
  isGuestUser: boolean,
): CartOwner | null {
  if (userId !== undefined) {
    if (!Number.isInteger(userId) || userId <= 0) {
      return null;
    }

    return { column: "user_id", value: userId };
  }

  if (isGuestUser) {
    return { column: "guest_id", value: GUEST_ID };
  }

  return null;
}

export async function getCart(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication Required",
      });
    }

    const userId = req.userId;

    const isGuest = req.query.guest === "true";
    const owner = getOwner(userId, isGuest);

    if (!owner) {
      return res.status(400).json({
        message: "Invalid user ID or cart owner",
      });
    }

    const items = await getCartItems(owner);
    return res.json(items);
  } catch {
    return res.status(500).json({
      message: "Failed to fetch cart",
    });
  }
}

export async function addToCart(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication Required",
      });
    }

    const userId = req.userId;

    const { productId, quantity = 1, color = "pink" } = req.body;

    const isGuest = req.query.guest === "true";
    const owner = getOwner(userId, isGuest);

    const product_Id = Number(productId);
    const quantity_count = Number(quantity);

    if (
      !owner ||
      !Number.isInteger(product_Id) ||
      product_Id <= 0 ||
      !Number.isInteger(quantity_count) ||
      quantity_count < 1 ||
      quantity_count > 100 ||
      typeof color !== "string" ||
      !color.trim()
    ) {
      return res.status(400).json({
        message: "Invalid cart item details",
      });
    }

    await insertCartItem({
      owner,
      productId: product_Id,
      quantity: quantity_count,
      color: color.trim(),
    });

    return res.status(200).json({
      message: "Cart item added",
    });
  } catch {
    return res.status(500).json({
      message: "Failed to add cart item",
    });
  }
}

export async function updateCart(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication Required",
      });
    }

    const userId = req.userId;

    const isGuest = req.query.guest === "true";
    const owner = getOwner(userId, isGuest);

    const cartItemId = Number(req.params.cartItemId);
    const quantity = Number(req.body.quantity);

    if (
      !owner ||
      !Number.isInteger(cartItemId) ||
      cartItemId <= 0 ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 100
    ) {
      return res.status(400).json({
        message: "Invalid cart item details",
      });
    }

    const result = await updateItem(owner, cartItemId, quantity);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    return res.json({
      message: "Cart quantity updated",
    });
  } catch {
    return res.status(500).json({
      message: "Failed to update cart",
    });
  }
}

export async function removeCartItem(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication Required",
      });
    }

    const userId = req.userId;

    const isGuest = req.query.guest === "true";
    const owner = getOwner(userId, isGuest);

    const cartItemId = Number(req.params.cartItemId);

    if (!owner || !Number.isInteger(cartItemId) || cartItemId <= 0) {
      return res.status(400).json({
        message: "Invalid cart item details",
      });
    }

    const result = await deleteItem(owner, cartItemId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    return res.json({
      message: "Item removed",
    });
  } catch {
    return res.status(500).json({
      message: "Failed to remove cart item",
    });
  }
}
