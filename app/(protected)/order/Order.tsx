"use client";

import { getOrders } from "@/api/api";
import type { Order } from "@/type/Order";
import useAuthStore from "@/zustandStore/authStore";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

function getStatusStyle(status: string | null | undefined) {
  switch ((status ?? "").toLowerCase()) {
    case "paid":
    case "succeeded":
    case "delivered":
    case "complete":
      return "bg-green-100 text-green-700";

    case "processing":
    case "preparing":
    case "shipped":
      return "bg-blue-100 text-blue-700";

    case "pending":
    case "requires_action":
      return "bg-yellow-100 text-yellow-700";

    case "failed":
    case "cancelled":
    case "canceled":
    case "expired":
    case "refunded":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function StatusBadge({ status }: { status: string | null }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(status)}`}
    >
      {status ?? "—"}
    </span>
  );
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString();
}

function Order() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useAuthStore((state) => state.currentUser);
  const isGuest = useAuthStore((state) => state.isGuest);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    const fetchOrders = async () => {
      try {
        const data = await getOrders(user?.id ?? null, !user?.id && isGuest);
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchOrders();
  }, [hasHydrated, isGuest, user?.id]);

  if (!hasHydrated || loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <Skeleton height={40} width={250} className="mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} height={56} borderRadius={12} />
          ))}
        </div>
      </main>
    );
  }

  return (
    <div>
      <main className="mx-auto max-w-7xl px-8 py-6">
        <h1 className="mb-4 text-2xl font-bold">Your Orders</h1>
        <hr className="mb-6 border-b" />
        <p>
          Total Orders : <span className="font-bold">{orders.length}</span>
        </p>

        {orders.length === 0 ? (
          <p className="mt-4">Place Order</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-304 text-left">
              <thead className="bg-primary-light text-sm">
                <tr className="text-center">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Products</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Payment Status</th>
                  <th className="p-3">Order Status</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Stripe Session ID</th>
                  <th className="p-3">Stripe Payment ID</th>
                  <th className="p-3">Date and Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr className="border-t text-center" key={order.id}>
                    <td className="p-3">{order.id}</td>
                    <td className="p-3">{order.name}</td>
                    <td className="p-3">{order.address}</td>
                    <td className="p-3">
                      <div className="flex flex-col gap-2">
                        {order.product.map((item, index) => (
                          <div
                            key={`${item.id}-${index}`}
                            className="flex items-center gap-4 rounded-lg p-2"
                          >
                            <p className="font-semibold">{item.name}</p>
                            <p>Quantity: {item.amount}</p>
                            <p>Color: {item.color}</p>
                            <p>Price: ${Number(item.price)}</p>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">{order.cost}</td>
                    <td className="p-3">
                      <StatusBadge status={order.payment.status} />
                    </td>
                    <td className="p-3">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="p-3">{order.payment.provider ?? "—"}</td>
                    <td className="p-3">{order.payment.sessionId ?? "-"}</td>
                    <td className="p-3">
                      {order.payment.transactionId ?? "-"}
                    </td>
                    <td className="whitespace-nowrap p-3">
                      {formatDateTime(order.dateTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default Order;
