import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/apiResponse";
import {
  handleStripeWebHook,
  StripeEvent,
} from "../services/stripeWebHookServices";
import { stripe } from "../lib/stripe";

export async function stripeWebHook(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return errorResponse(res, {
      message: "Stripe webhook config is missing",
      statusCode: 500,
    });
  }

  if (typeof signature !== "string") {
    return errorResponse(res, {
      message: "Invalid stripe webhook",
      statusCode: 400,
    });
  }
  let event: StripeEvent;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.log(error);
    return errorResponse(res, {
      message: "Invalid webhook signature",
      statusCode: 400,
    });
  }
  try {
    await handleStripeWebHook(event);
    return successResponse(res, {
      message: "stripe webhook event handle successfully",
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(res, {
      message: "stripe webhook processing failed",
      statusCode: 500,
    });
  }
}
