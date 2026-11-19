import type { Request, Response } from "express";
import crypto from "node:crypto";

export async function razorpayWebHook(req: Request, res: Response) {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret || typeof signature !== "string") {
      return res.status(400).json({
        message: "Missing webhook signature",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest();

    const receivedSignature = Buffer.from(signature, "hex");

    if (
      receivedSignature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(receivedSignature, expectedSignature)
    ) {
      return res.status(400).json({
        message: "Invalid webhook signature",
      });
    }

    const event = JSON.parse(req.body.toString());

    console.log("event ", event);

    return res.status(200).json({
      message: "Webhook signature verified",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "WebHook failed",
    });
  }
}
