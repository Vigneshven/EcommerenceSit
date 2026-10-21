"use client";

import { formatPrice, parsePrice } from "@/lib/utils/price";
import { cart } from "@/type/Cart";

type OrderSummaryProps = {
  cart: cart[];
  loading: boolean;
};

function OrderSummary({ cart, loading }: OrderSummaryProps) {
  const subtotal = cart.reduce((total, item) => {
    return total + parsePrice(item.price) * Number(item.amount ?? 0);
  }, 0);

  const SHIPPING = 15;
  const TAX_RATE = 0.1;

  const shipping = subtotal === 0 || subtotal >= 1000 ? 0 : SHIPPING;

  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

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
