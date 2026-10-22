"use client";

import { calculateOrderSummary } from "@/lib/utils/orderSummary";
import { formatPrice, parsePrice } from "@/lib/utils/price";
import { cart } from "@/type/Cart";

type OrderSummaryProps = {
  cart: cart[];
  loading: boolean;
};

function OrderSummary({ cart, loading }: OrderSummaryProps) {
  const { subtotal, shipping, tax, total } = calculateOrderSummary(cart);

  return (
    <aside className="h-fit rounded-2xl bg-primary-light p-6">
      <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
      {loading ? (
        <p>Loading order summary...</p>
      ) : (
        <div className="space-y-3 text-text-light">
          <div className="flex justify-between">
            <span>SubTotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div>
            <div className="flex justify-between">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default OrderSummary;
