import { prisma } from "../lib/prisma";
import { PaymentOrderProduct, PaymentOwner } from "../type/payment";

export async function getPaymentCart(owner: PaymentOwner) {
  return prisma.cart_items.findMany({
    where:
      owner.userId !== null
        ? { user_id: owner.userId }
        : {
            user_id: null,
            guest_id: owner.guestId,
          },
    select: {
      cart_item_id: true,
      product_id: true,
      quantity: true,
      color: true,
      products: {
        select: {
          id: true,
          name: true,
          price: true,
          stock_quantity: true,
        },
      },
    },
  });
}

export async function createPendingPaymentOrder(data: {
  owner: PaymentOwner;
  name: string;
  address: string;
  products: PaymentOrderProduct[];
  cost: string;
}) {
  return prisma.orders.create({
    data: {
      user_id: data.owner.userId,
      guest_id: data.owner.guestId,
      name: data.name,
      address: data.address,
      product: data.products,
      cost: data.cost,
      order_status: "pending",
      payment_status: "pending",
    },
  });
}

export async function updateStripeSession(orderId: number, sessionId: string) {
  return prisma.orders.update({
    where: { order_id: orderId },
    data: { stripe_session_id: sessionId },
  });
}

export async function updatePaymentFailed(orderId: number) {
  return prisma.orders.update({
    where: { order_id: orderId },
    data: { payment_status: "failed" },
  });
}

export async function getPaymentOrder(orderId: number) {
  return prisma.orders.findUnique({
    where: { order_id: orderId },
    select: {
      order_id: true,
      cost: true,
      product: true,
      user_id: true,
      guest_id: true,
      stripe_session_id: true,
      stripe_payment_id: true,
      payment_status: true, 
    },
  });
}

export async function completePaymentOrder(data: {
  orderId: number;
  sessionId: string;
  paymentId: string | null;
  cartItemId: number[];
  userId: number | null;
  guestId: string | null;
}) {
  return prisma.$transaction(async (tx) => {
    const update = await tx.orders.updateMany({
      where: {
        order_id: data.orderId,
        stripe_session_id: data.sessionId,
        payment_status: "pending",
      },
      data: {
        payment_status: "paid",
        order_status: "processing",
        stripe_payment_id: data.paymentId,
      },
    });
    if (update.count === 0) {
      return false;
    }
    if (data.cartItemId.length > 0) {
      await tx.cart_items.deleteMany({
        where: {
          cart_item_id: { in: data.cartItemId },
          ...(data.userId !== null
            ? { user_id: data.userId }
            : { user_id: null, guest_id: data.guestId }),
        },
      });
    }
    return true;
  });
}

export async function updatePaymentFailedBySession(sessionId: string) {
  return prisma.orders.updateMany({
    where: {
      stripe_session_id: sessionId,
      payment_status: "pending",
    },
    data: {
      payment_status: "failed",
    },
  });
}
