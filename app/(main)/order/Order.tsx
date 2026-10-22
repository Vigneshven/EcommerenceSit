"use client";

import { getOrders } from "@/api/api";
import type { Order } from "@/type/Order";
import useAuthStore from "@/zustandStore/authStore";
import { useEffect, useState } from "react";

function Order() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const users = useAuthStore((state) => state.currentUser);
  const isGuest = useAuthStore((state) => state.isGuest);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!users && !isGuest) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrders(users?.id ?? null, isGuest);
        setOrders(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [users?.id, isGuest, hasHydrated]);

  return (
    <div>
      <main className="mx-auto max-w-7xl px-8 py-6">
        <h1 className="font-bold text-2xl mb-4">Your Orders</h1>
        <hr className="mb-6 border-b" />
        <p>
          Total Orders : <span className="font-bold">{orders.length}</span>
        </p>
        {loading ? (
          <p>Loading Orders....</p>
        ) : orders.length === 0 ? (
          <p>Place Order</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border border-none">
            <table className="w-full min-w-175 text-left border-8">
              <thead className="bg-primary-light">
                <tr className="text-center">
                  <td className="p-3">Order ID</td>
                  <td className="p-3">Name</td>
                  <td className="p-3">Address</td>
                  <td className="p-3">Product</td>
                  <td className="p-3">Cost</td>
                  <td className="p-3">Date and Time</td>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr className="border-t-1.2 text-center p-3" key={order.id}>
                    <td className="p-3">{order.id}</td>
                    <td className="p-3">{order.name}</td>
                    <td className="p-3">{order.address}</td>
                    <td className="p-3">
                      <div className="flex flex-col gap-2">
                        {order.product.map((item, index) => (
                          <div
                            key={`${item.id}-${index}`}
                            className="rounded-lg p-2 flex gap-7 items-center"
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
                    <td className="p-3">{order.dateTime}</td>
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
