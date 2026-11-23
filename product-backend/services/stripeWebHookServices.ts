import { stripe } from "../lib/stripe";
import {
  completePaymentOrder,
  getCheckoutSession,
  updatePaymentFailedBySession,
} from "../models/paymentModel";

export type StripeEvent = ReturnType<typeof stripe.webhooks.constructEvent>;
export async function handleStripeWebHook(event: StripeEvent) {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;
      if (session.payment_status !== "paid") return;
      const checkout = await getCheckoutSession(session.id);
      if (!checkout) throw new Error("Invalid checkout session");
      const expectedAmount = Math.round(Number(checkout.cost) * 100);

      if (
        !Number.isSafeInteger(expectedAmount) ||
        session.amount_total !== expectedAmount ||
        session.currency?.toLowerCase() !== "inr"
      ) {
        throw new Error("Invalid payment amount");
      }

      const products = checkout.product as Array<{
        cartItemId: number;
        id: number;
        name: string;
        amount: number;
        price: number;
        color: string;
      }>;

      await completePaymentOrder({
        checkoutSessionId: checkout.checkout_session_id,
        sessionId: session.id,
        paymentId: typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
        owner: { userId: checkout.user_id, guestId: checkout.guest_id },
        name: checkout.name,
        address: checkout.address,
        products,
        cost: String(checkout.cost),
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
