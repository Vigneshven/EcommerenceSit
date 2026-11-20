import { stripe } from "../lib/stripe";
import {
  createPendingPaymentOrder,
  getPaymentCart,
  updatePaymentFailed,
  updateStripeSession,
} from "../models/paymentModel";
import { PaymentOrderProduct, PaymentOwner } from "../type/payment";

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

  const order = await createPendingPaymentOrder({
    owner,
    name: details.name,
    address: details.address,
    products,
    cost: orderCost,
  });
  try {
    const session = await stripe.checkout.sessions.create({
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
      metadata: {
        orderId: String(order.order_id),
      },
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    });

    if (!session.url) {
      throw new Error("Stripe checkout url not found");
    }

    await updateStripeSession(order.order_id, session.id);

    return {
      orderId: order.order_id,
      checkoutUrl: session.url,
      sessionId: session.id,
      subtotal: subtotal,
      tax: tax,
      shipping: shipping,
      total: total,
    };
  } catch (error) {
    await updatePaymentFailed(order.order_id);
    throw error;
  }
}
