import useShopStore from "../zustandStore/shopStore";
import useAuthStore from "../zustandStore/authStore";

const SHIPPING = 15;
const TAX_RATE = 0.1;

function formatPrice(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function OrderSummary() {
  const carts = useShopStore((state) => state.cart);
  const user = useAuthStore((state) => state.currentUser);

  const cartKey = user ? `user:${user.email.toLowerCase()}` : "guest";

  const cart = carts?.[cartKey] ? carts[cartKey] : [];

  const subtotal = cart.reduce((total, item) => {
    const price = Number(item.price.replace(/[^\d.-]/g, ""));
    return total + price * item.amount;
  }, 0);

  const shipping = subtotal === 0 || subtotal >= 1000 ? 0 : SHIPPING;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return (
    <aside className="h-fit rounded-xl bg-primary-light p-6">
      <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

      <div className="space-y-3 text-text-light">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax (10%)</span>
          <span>{formatPrice(tax)}</span>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default OrderSummary;
