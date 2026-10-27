import type { Request, Response } from "express";
import {
  addCartItems as insertCartItem,
  getCartItems,
  updateCartItem as updateItem,
  deleteCartItem as deleteItem,
  type CartOwner,
} from "../models/cartModel";

function getOwner(req: Request): CartOwner | null {
  if (req.userId !== undefined) {
    if (!Number.isInteger(req.userId) || req.userId <= 0) {
      return null;
    }

    return { column: "user_id", value: req.userId };
  }

  if (req.guestId) {
    return { column: "guest_id", value: req.guestId };
  }

  return null;
}

export async function getCart(req: Request, res: Response) {
  try {
    let owner = getOwner(req);

    if (req.userId !== undefined) {
      if (!Number.isInteger(req.userId) || req.userId <= 0) {
        return res.status(401).json({
          message: "Invalid authentication user",
        });
      }
      owner = {
        column: "user_id",
        value: req.userId,
      };
    } else if (req.guestId) {
      owner = {
        column: "guest_id",
        value: req.guestId,
      };
    } else {
      return res.status(401).json({
        message: "authenticate user or guest required",
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
    const owner = getOwner(req);
    if (!owner) {
      return res.status(401).json({
        message: "Authentication Required",
      });
    }

    // const userId = req.userId;

    const { productId, quantity = 1, color = "pink" } = req.body;

    // const isGuest = req.query.guest === "true";

    if (!owner) {
      return res.status(401).json({
        message: "cart identity required",
      });
    }

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
    const owner = getOwner(req);
    const cartItemId = Number(req.params.cartItemId);

    if (!owner) {
      return res.status(401).json({
        message: "authentication required",
      });
    }
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        message: "request body is missing",
      });
    }

    if (req.body?.quantity === undefined) {
      console.log("quantity missing");
      return res.status(400).json({
        message: "quantity is required",
      });
    }

    const quantity = Number(req.body.quantity);

    if (
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
    const owner = getOwner(req);
    if (!owner) {
      return res.status(401).json({
        message: "Authentication Required",
      });
    }

    // const userId = req.userId;

    // const isGuest = req.query.guest === "true";

    if (!owner) {
      return res.status(401).json({
        message: "cart identity required",
      });
    }

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
