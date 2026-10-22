import { parsePrice } from "@/lib/utils/price";
import type { cart } from "@/type/Cart";

const SHIPPING = 15;
const TAX_RATE = 0.1;
const FREE_SHIPPING_LIMIT = 1000;

export function calculateOrderSummary(cart: cart[]) {
  const subtotal = cart.reduce((total, item) => {
    return total + parsePrice(item.price) * Number(item.amount ?? 0);
  }, 0);

  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING;

  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
}
