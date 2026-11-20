import { prisma } from "../lib/prisma";

export type OrderProduct = {
  id: number;
  name: string;
  amount: number;
  price: string | number;
  color: string;
};
export async function getOrdersByUser(userId: number) {
  return await prisma.orders.findMany({
    where: {
      user_id: userId,
      payment_status: "paid",
    },
    orderBy: {
      date_time: "asc",
    },
  });
}

export async function getGuestOrder(guestId: string) {
  return await prisma.orders.findMany({
    where: {
      guest_id: guestId,
      user_id: null,
      payment_status: "paid",
    },
    orderBy: {
      date_time: "asc",
    },
  });
}
