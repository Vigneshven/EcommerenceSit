"use client";

import { formatPrice, parsePrice } from "@/lib/utils/price";
import useAuthStore from "@/zustandStore/authStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { cart as CartItem } from "@/type/Cart";
import { deleteCartItem, getCart, updateCartItem } from "@/api/api";
import { toast } from "sonner";
import OrderSummary from "@/components/OrderSummary";
import Skeleton from "react-loading-skeleton";

export default function Cart() {
  const router = useRouter();

  const user = useAuthStore((state) => state.currentUser);

  const isGuest = useAuthStore((state) => state.isGuest);

  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const userId = user?.id;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<number | null>(null);

  const [maxAmount, setMaxAmount] = useState<Record<number, number>>({});
  const loadCart = useCallback(async () => {
    setLoading(true);

    try {
      const items = await getCart(userId, isGuest);
      setCart(items);
    } catch {
      toast.error("Unable to load cart");
    } finally {
      setLoading(false);
    }
  }, [userId, isGuest]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (user?.id) {
      loadCart(user.id, false);
    } else if (isGuest) {
      loadCart(undefined, true);
    } else {
      setCart([]);
      setLoading(false);
    }
  }, [hasHydrated, loadCart, user?.id, isGuest]);

  async function handleQtyChange(item: CartItem, quantity: number) {
    setItems(item.cartItemId);

    try {
      await updateCartItem(item.cartItemId, quantity, userId, isGuest);
      await loadCart();

      setCart((prev) =>
        prev.map((current) =>
          current.cartItemId === item.cartItemId
            ? { ...current, amount: quantity }
            : current,
        ),
      );

      setMaxAmount((prev) => {
        const currentMax = prev[item.cartItemId] ?? 5;

        return {
          ...prev,
          [item.cartItemId]:
            quantity >= currentMax ? Math.min(currentMax + 5, 100) : currentMax,
        };
      });

      toast.success("cart updated...");
    } catch {
      toast.error("failed to update...");
    } finally {
      setItems(null);
    }
  }

  async function handleRemove(cartItemId: number) {
    setItems(cartItemId);

    try {
      await deleteCartItem(cartItemId, userId, isGuest);
      setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));

      toast.success("item removed...");
    } catch {
      toast.error("failed to remove");
    } finally {
      setItems(null);
    }
  }

  // const subtotal = cart.reduce(
  //   (total, item) => total + parsePrice(item.price) * Number(item.amount ?? 0),
  //   0,
  // );
  if (!hasHydrated || loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <Skeleton height={40} width={250} className="mb-8" />

        <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
          <section className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex gap-5 border-b border-border pb-6"
              >
                <Skeleton width={128} height={128} borderRadius={12} />

                <div className="flex-1">
                  <Skeleton width="65%" height={24} />
                  <Skeleton width="35%" className="mt-3" />
                  <Skeleton width={90} height={36} className="mt-5" />
                </div>
              </div>
            ))}
          </section>

          <aside>
            <Skeleton height={300} borderRadius={16} />
          </aside>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="mx-auto w-full max-w-7xl px-6 py-12">
        <h1 className="mb-8 border-b border-border pb-6 text-3xl font-bold text-heading">
          Shopping Cart
        </h1>
        {cart.length === 0 ? (
          <h2>Your Cart is Empty</h2>
        ) : (
          <div className="grid  gap-10 lg:grid-cols-[1fr_22rem]">
            <section className="space-y-6">
              {cart.map((item) => (
                <article
                  key={item.cartItemId}
                  className="flex flex-col gap-4 border-b border-border sm:flex-row sm:items-center"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={600}
                    height={600}
                    className="h-32 w-38 object-cover rounded-xl"
                    loading="eager"
                  ></Image>
                  <div className="flex gap-40 w-full">
                    <div className="flex flex-col gap-2">
                      <h2 className="font-semibold text-heading">
                        {item.name}
                      </h2>
                      <p className="text-muted-text">{item.company}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span>Color:</span>
                        <span
                          className="h-5 w-5 rounded-full border border-border"
                          style={{ backgroundColor: item.color }}
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3 mr-50">
                    <label>Amount</label>
                    <select
                      value={item.amount}
                      disabled={items === item.cartItemId}
                      onChange={(e) => {
                        handleQtyChange(item, Number(e.target.value));
                      }}
                      className="rounded-lg border border-border bg-input-background p-2 text-heading"
                    >
                      {Array.from(
                        {
                          length:
                            maxAmount[item.cartItemId] ??
                            Math.max(5, item.amount),
                        },
                        (_, i) => i + 1,
                      ).map((amount) => (
                        <option key={amount} value={amount}>
                          {amount}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleRemove(item.cartItemId)}
                      className="text-sm text-primary hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:flex-col">
                    <p>
                      {formatPrice(
                        parsePrice(item.price) * Number(item.amount ?? 0),
                      )}
                    </p>
                  </div>
                </article>
              ))}
            </section>
            <aside>
              <OrderSummary cart={cart} loading={loading} />
              {!user && !isGuest ? (
                <button
                  onClick={() => router.push("/login")}
                  className="bg-primary w-full px-4 py-3 rounded-lg text-on-primary hover:cursor-pointer"
                >
                  Please Login
                </button>
              ) : (
                <button
                  onClick={() => router.push("/checkout")}
                  className="bg-primary w-full px-4 py-3 rounded-lg text-on-primary hover:cursor-pointer"
                >
                  Proceed To Checkout
                </button>
              )}
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
