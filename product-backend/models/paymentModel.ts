import { prisma } from "../lib/prisma";
import { PaymentOrderProduct, PaymentOwner } from "../type/payment";

export async function getPaymentCart(owner: PaymentOwner) {
  return prisma.cart_items.findMany({
    where:
      owner.userId !== null
        ? { user_id: owner.userId }
        : { user_id: null, guest_id: owner.guestId },
    select: {
      cart_item_id: true,
      product_id: true,
      quantity: true,
      color: true,
      products: {
        select: { id: true, name: true, price: true, stock_quantity: true },
      },
    },
  });
}

export async function getPendingCheckoutSessions(owner: PaymentOwner) {
  return prisma.checkout_sessions.findMany({
    where: {
      status: "pending",
      ...(owner.userId !== null
        ? { user_id: owner.userId, guest_id: null }
        : { user_id: null, guest_id: owner.guestId }),
    },
    select: {
      stripe_session_id: true,
      name: true,
      address: true,
      product: true,
      cost: true,
      status: true,
      created_at: true,
    },
    orderBy: { created_at: "desc" },
  });
}

export async function createCheckoutSession(data: {
  owner: PaymentOwner;
  name: string;
  address: string;
  products: PaymentOrderProduct[];
  cost: string;
  stripeSessionId: string;
}) {
  return prisma.checkout_sessions.create({
    data: {
      stripe_session_id: data.stripeSessionId,
      user_id: data.owner.userId,
      guest_id: data.owner.guestId,
      name: data.name,
      address: data.address,
      product: data.products,
      cost: data.cost,
    },
  });
}

export async function getCheckoutSession(stripeSessionId: string) {
  return prisma.checkout_sessions.findUnique({
    where: { stripe_session_id: stripeSessionId },
  });
}

export async function completePaymentOrder(data: {
  checkoutSessionId: number;
  sessionId: string;
  paymentId: string | null;
  owner: PaymentOwner;
  name: string;
  address: string;
  products: PaymentOrderProduct[];
  cost: string;
}) {
  return prisma.$transaction(async (tx) => {
    const checkout = await tx.checkout_sessions.updateMany({
      where: {
        checkout_session_id: data.checkoutSessionId,
        stripe_session_id: data.sessionId,
        completed_at: null,
      },
      data: { status: "paid", completed_at: new Date() },
    });

    if (checkout.count === 0) return false;

    await tx.orders.create({
      data: {
        user_id: data.owner.userId,
        guest_id: data.owner.guestId,
        name: data.name,
        address: data.address,
        product: data.products,
        cost: data.cost,
        order_status: "processing",
        payment_status: "paid",
        stripe_session_id: data.sessionId,
        stripe_payment_id: data.paymentId,
      },
    });

    const cartItemIds = data.products.map((item) => item.cartItemId);
    if (cartItemIds.length > 0) {
      await tx.cart_items.deleteMany({
        where: {
          cart_item_id: { in: cartItemIds },
          ...(data.owner.userId !== null
            ? { user_id: data.owner.userId }
            : { user_id: null, guest_id: data.owner.guestId }),
        },
      });
    }
    return true;
  });
}

export async function updatePaymentFailedBySession(sessionId: string) {
  return prisma.checkout_sessions.updateMany({
    where: { stripe_session_id: sessionId, completed_at: null },
    data: { status: "failed" },
  });
}
