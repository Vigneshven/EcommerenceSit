import { stripe } from "../lib/stripe";
import {
  completePaymentOrder,
  getPaymentOrder,
  updatePaymentFailedBySession,
} from "../models/paymentModel";

export type StripeEvent = ReturnType<typeof stripe.webhooks.constructEvent>;
export async function handleStripeWebHook(event: StripeEvent) {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;
      if (session.payment_status !== "paid") return;
      const orderId = Number(session.metadata?.orderId);
      if (!orderId) {
        throw new Error("Order id not found");
      }
      const order = await getPaymentOrder(orderId);
      if (!order) {
        throw new Error("Invalid order id");
      }
      if (order.stripe_session_id !== session.id) {
        throw new Error("Invalid stripe session");
      }
      const expectedAmount = Math.round(Number(order.cost) * 100);

      if (
        !Number.isSafeInteger(expectedAmount) ||
        session.amount_total !== expectedAmount ||
        session.currency?.toLowerCase() !== "inr"
      ) {
        throw new Error("Invalid payment amount");
      }

      const products = order.product as Array<{ cartItemId: number }>;

      await completePaymentOrder({
        orderId,
        sessionId: session.id,
        paymentId: typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
        cartItemId: products.map((item) => item.cartItemId),
        userId: order.user_id,
        guestId: order.guest_id,
      });
      break;
    }
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      const session = event.data.object;
      await updatePaymentFailedBySession(session.id);
      break;
    }
    default:
      break;
  }
}
