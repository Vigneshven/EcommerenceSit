import { type Request, type Response } from "express";
import {
  createOrder,
  getGuestOrder,
  getOrdersByUser,
} from "../models/orderModel";
import { RowDataPacket } from "mysql2";

export type OrderProduct = {
  id: number;
  name: string;
  amount: number;
  price: string;
  color: string;
};

export type OrderRow = RowDataPacket & {
  order_id: number;
  name: string;
  address: string;
  product: OrderProduct[] | string;
  cost: string | number;
  date_time: string;
};

export async function getOrders(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication Required",
      });
    }

    const userId = req.userId;

    const guest = req.query.guest === "true";

    const rows = guest ? await getGuestOrder() : await getOrdersByUser(userId);

    const orders = rows.map((row) => ({
      id: row.order_id,
      name: row.name,
      address: row.address,
      product:
        typeof row.product === "string" ? JSON.parse(row.product) : row.product,
      cost: Number(row.cost),
      dateTime: row.date_time,
    }));

    return res.json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to fetch orders",
    });
  }
}

export async function placeOrder(req: Request, res: Response) {
  try {
    const { name, address, product, cost } = req.body;

    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication Required",
      });
    }
    const userId = req.userId;

    const isLoginUser = Number.isInteger(userId) && userId > 0;

    const isguest = req.query.guest === "true";

    if (!isLoginUser && !isguest)
      return res
        .status(401)
        .json({ message: "please login or enter guest mode" });

    if (
      (isLoginUser && (!Number.isInteger(userId) || userId <= 0)) ||
      typeof name !== "string" ||
      name.trim().length < 3 ||
      typeof address !== "string" ||
      address.trim().length < 5 ||
      !Array.isArray(product) ||
      product.length === 0 ||
      !Number.isFinite(cost) ||
      cost < 0
    ) {
      return res.status(400).json({
        message: "Invalid order details",
      });
    }
    const orderId = await createOrder({
      userId: isLoginUser ? userId : null,
      guestId: isguest ? "0" : null,
      name: name.trim(),
      address: address.trim(),
      product: product as OrderProduct[],
      cost,
    });
    return res.status(201).json({
      message: "Order placed successfully",
      id: orderId,
    });
  } catch {
    return res.status(500).json({
      message: "Failed to place order",
    });
  }
}
