import { type Request, type Response } from "express";
import { getGuestOrder, getOrdersByUser } from "../models/orderModel";
import { errorResponse, successResponse } from "../utils/apiResponse";

function normalizeProducts(product: unknown) {
  if (Array.isArray(product)) return product;
  if (typeof product !== "string") return [];

  try {
    const parsed = JSON.parse(product);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getOrders(req: Request, res: Response) {
  try {
    let rows;

    if (req.userId) {
      rows = await getOrdersByUser(req.userId);
    } else if (req.guestId) {
      rows = await getGuestOrder(req.guestId);
    } else {
      return res.status(401).json({
        message: "Authentication Required",
      });
    }

    const orders = rows.map((row) => ({
      id: row.order_id,
      name: row.name,
      address: row.address,
      product: normalizeProducts(row.product),
      cost: Number(row.cost),
      dateTime: row.date_time,
      payment: {
        status: row.payment_status,
        provider: row.stripe_payment_id || row.stripe_session_id ? "Stripe" : null,
        transactionId: row.stripe_payment_id,
        sessionId: row.stripe_session_id,
      },
      orderStatus: row.order_status,
    }));

    return successResponse(res, {
      message: "Orders fetched successfully",
      data: orders,
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res, {
      message: "Failed to fetch orders",
      statusCode: 500,
    });
  }
}
