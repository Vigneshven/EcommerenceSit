import { stripe } from "../lib/stripe";
import {
  createCheckoutSession,
  getPaymentCart,
} from "../models/paymentModel";
import { getPendingCheckoutSessions as getPendingCheckoutSessionRows } from "../models/paymentModel";
import type { PaymentOrderProduct, PaymentOwner } from "../type/payment";

export async function createCheckout(
  owner: PaymentOwner,
  details: {
    name: string;
    address: string;
  },
) {
  const cartItems = await getPaymentCart(owner);

  if (!cartItems.length) {
    throw new Error("Cart must contain at least one product");
  }

  const products: PaymentOrderProduct[] = cartItems.map((item) => {
    const price = Number(item.products.price);

    if (price <= 0) {
      throw new Error("Invalid product price in db");
    }

    if (item.quantity < 1 || item.quantity > 100) {
      throw new Error("Invalid product qty");
    }

    return {
      cartItemId: item.cart_item_id,
      id: item.products.id,
      name: item.products.name,
      amount: item.quantity,
      price,
      color: item.color,
    };
  });

  const subtotal = products.reduce(
    (sum, item) => sum + Math.round(Number(item.price) * 100) * item.amount,
    0,
  );

  const tax = Math.round(subtotal * 0.1);
  const shipping = subtotal > 0 && subtotal < 100000 ? 1500 : 0;

  const total = subtotal + tax + shipping;

  const orderCost = String(total / 100);

  const session = await stripe.checkout.sessions.create({
      ui_mode: "elements",
      mode: "payment",
      line_items: [
        ...products.map((item) => ({
          quantity: item.amount,
          price_data: {
            currency: "inr",
            unit_amount: Math.round(Number(item.price) * 100),
            product_data: {
              name: item.name,
              description: `Color : ${item.color}`,
            },
          },
        })),
        ...(tax > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: "inr",
                  unit_amount: tax,
                  product_data: {
                    name: "Tax (10%)",
                  },
                },
              },
            ]
          : []),
        ...(shipping > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: "inr",
                  unit_amount: shipping,
                  product_data: {
                    name: "shipping",
                  },
                },
              },
            ]
          : []),
      ],
      return_url: `${process.env.FRONTEND_URL}/order`,
    });

    if (!session.client_secret) {
      throw new Error("Stripe client secret not found");
    }

    await createCheckoutSession({
      owner,
      name: details.name,
      address: details.address,
      products,
      cost: orderCost,
      stripeSessionId: session.id,
    });

    return {
      clientSecret: session.client_secret,
      sessionId: session.id,
      subtotal: subtotal,
      tax: tax,
      shipping: shipping,
      total: total,
    };
}

export async function getPendingCheckoutSessions(owner: PaymentOwner) {
  return getPendingCheckoutSessionRows(owner);
}
