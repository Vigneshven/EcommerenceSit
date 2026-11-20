import { type Request, type Response } from "express";
import { errorResponse, successResponse } from "../utils/apiResponse";
import { createCheckout } from "../services/paymentServices";

export async function createPaymentCheckout(req: Request, res: Response) {
  try {
    const { name, address } = req.body;

    if (
      typeof name !== "string" ||
      typeof address !== "string" ||
      !name.trim() ||
      !address.trim()
    ) {
      return errorResponse(res, {
        message: "Invalid order details",
        statusCode: 400,
      });
    }

    let owner: { userId: number | null; guestId: string | null };

    if (typeof req.userId === "number" && req.userId > 0) {
      owner = {
        userId: req.userId,
        guestId: null,
      };
    } else if (typeof req.guestId === "string") {
      owner = {
        userId: null,
        guestId: req.guestId,
      };
    } else {
      return errorResponse(res, {
        message: "Authentication or guest session required",
        statusCode: 401,
      });
    }

    const checkout = await createCheckout(owner, {
      name: name,
      address: address,
    });

    return successResponse(res, {
      message: "Checkout session created succcesfully",
      data: checkout,
      statusCode: 201,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res, {
      message: "Failed to create payment session",
      statusCode: 500,
    });
  }
}
