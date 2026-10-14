import Account from "./Account";
import Header from "./Header";
import OrderSummary from "./OrderSummary";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuthStore from "../zustandStore/authStore";
import useShopStore from "../zustandStore/shopStore";
import { useState } from "react";

function formatPrice(price: number) {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function Cart() {
  const carts = useShopStore((state) => state.cart);

  const updateCartAmount = useShopStore((state) => state.updateCartAmount);

  const removeFromCart = useShopStore((state) => state.removeFromCart);

  const user = useAuthStore((state) => state.currentUser);

  const cartKey = user ? `user:${user.email.toLowerCase()}` : "guest";

  const cart = carts[cartKey] ? carts[cartKey] : [];

  const [maxAmount, setMaxAmount] = useState<Record<number, number>>({});

  const navigate = useNavigate();

  return (
    <div>
      <Account />
      <Header />

      <main className="mx-auto w-full max-w-7xl px-6 py-12">
        <h1 className="mb-8 border-b border-border pb-6 text-3xl font-bold text-heading">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <h2 className="pt-8 text-2xl text-text-light">Your cart is empty</h2>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
            <section className="space-y-6">
              {cart.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-28 w-32 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold text-heading">{item.name}</h2>

                    <p className="text-muted-text">{item.company}</p>

                    <div className="mt-2 flex items-center gap-2">
                      <span>Color:</span>
                      <span
                        className="h-5 w-5 rounded-full border border-border"
                        style={{
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col mr-50 items-center gap-3">
                    <label htmlFor={`amount-${item.id}`}>Amount</label>
                    <select
                      id={`amount-${item.id}`}
                      value={item.amount}
                      onChange={(e) => {
                        const amount = Number(e.target.value);
                        const currentMax = maxAmount[item.id] ?? 8;

                        if (amount === currentMax) {
                          setMaxAmount((prev) => ({
                            ...prev,
                            [item.id]: currentMax + 5,
                          }));
                        }

                        updateCartAmount({
                          id: item.id,
                          amount,
                        });

                        toast.success("Cart updated...");
                      }}
                      className="rounded-lg border border-border bg-input-background p-2 text-heading"
                    >
                      {Array.from(
                        { length: maxAmount[item.id] ?? 8 },
                        (_, i) => i + 1,
                      ).map((amount) => (
                        <option key={amount} value={amount}>
                          {amount}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col">
                    <p className="font-semibold text-heading">
                      {formatPrice(
                        Number(item.price.replace(/[^\d.-]/g, "")) *
                          item.amount,
                      )}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        (removeFromCart(item.id),
                          toast.success("items removed from cart..."));
                      }}
                      className="text-sm text-primary hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-xl bg-primary-light p-6">
              <OrderSummary />

              {!user ? (
                <button
                  type="button"
                  className="mt-6 w-full rounded-lg bg-primary px-4 py-3 font-bold text-on-primary hover:opacity-90 cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Please Login
                </button>
              ) : (
                <button
                  type="button"
                  className="mt-6 w-full rounded-lg bg-primary px-4 py-3 font-bold text-on-primary hover:opacity-90 cursor-pointer"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed To Checkout
                </button>
              )}
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;
