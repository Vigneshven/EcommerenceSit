"use client";

import formatPrice from "@/lib/utils/price";
import useAuthStore from "@/zustandStore/authStore";
import useShopStore from "@/zustandStore/ShopStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Cart() {
  const router = useRouter();

  const carts = useShopStore((state) => state.cart);

  const updateCartAmount = useShopStore((state) => state.updateCartAmount);

  const removeFromCart = useShopStore((state) => state.removeFromCart);

  const user = useAuthStore((state) => state.currentUser);

  const cartKey = user ? `user:${user.email.toLowerCase()}` : "guest";

  const cart = carts[cartKey] ? carts[cartKey] : [];

  const [maxAmount, setMaxAmount] = useState<Record<number, number>>({});

  return (
    <>
      <main className="mx-auto w-full max-w-7xl px-6 py-12">
        <h1 className="mb-8 border-b border-border pb-6 text-3xl font-bold text-heading">
          Shopping Cart
        </h1>
        {cart.length? (
          <h2>Your Cart is Empty</h2>
        ) : (
          <div>
            <section>
              {cart.map((item) => (
                <article key={item.id}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={500}
                  ></Image>
                  <div>
                    <h2>{item.name}</h2>
                    <p>{item.company}</p>
                    <div>
                      <span>Color:</span>
                      <span></span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="">Amount</label>
                    <select name="" id="">
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
                  <div>
                    <p>
                      {formatPrice(
                        Number(item.price.replace(/[^\d.-]/g, "")) *
                          item.amount,
                      )}
                    </p>

                    <button>Remove</button>
                  </div>
                </article>
              ))}
            </section>
            <aside>
              <button onClick={()=>router.push("/login")}>Please Login</button>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
