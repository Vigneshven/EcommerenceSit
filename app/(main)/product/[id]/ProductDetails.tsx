"use client";

import { useState } from "react";
import ColorSelector from "@/components/ColorSelector";
import { toast } from "sonner";
import type { Product } from "@/type/Product";
import useShopStore from "@/zustandStore/ShopStore";
import Image from "next/image";
import { addToCart as addCartItem } from "@/api/api";
import useAuthStore from "@/zustandStore/authStore";

type Props = {
  product: Product;
};

export default function ProductDetails({ product }: Props) {
  const [amount, setAmount] = useState("1");
  const [adding, setAdding] = useState(false);

  const currentUser = useAuthStore((state) => state.currentUser);
  const isGuest = useAuthStore((state) => state.isGuest);
  const addAnonymousUser = useShopStore((state) => state.addAnonymousCartItem);
  const markCartChanged = useShopStore((state) => state.markCartChanged);
  const selectedColor = useShopStore((state) => state.selectedColor);

  async function handleAddToCart() {
    try {
      setAdding(true);

      const userId = Number(currentUser?.id);

      if (userId) {
        await addCartItem(
          {
            userId,
            productId: product.id,
            quantity: Number(amount),
            color: selectedColor,
          },
          false,
        );
        markCartChanged();
      } else if (isGuest) {
        await addCartItem(
          {
            productId: product.id,
            quantity: Number(amount),
            color: selectedColor,
          },
          true,
        );
        markCartChanged();
      } else {
        addAnonymousUser({
          id: product.id,
          image: product.image,
          company: product.company,
          name: product.name,
          amount: Number(amount),
          price: product.price,
          color: selectedColor,
        });
      }
      toast.success("added to cart");
    } catch {
      toast.error("failed to add");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div>
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
          <div className="w-full md:w-1/2">
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={500}
              loading="eager"
            />
          </div>

          <div className="flex w-full flex-col items-start gap-5 md:w-1/2">
            <h1 className="text-4xl font-extrabold">{product.name}</h1>

            <h3 className="text-lg">{product.company}</h3>

            <p className="text-xl font-bold">{product.price}</p>

            <p className="leading-7">{product.description}</p>

            <h3 className="text-lg font-semibold">Colors</h3>
            <ColorSelector />

            <label htmlFor="amount">Amount</label>
            <select
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-24 rounded-lg border p-2"
            >
              {[1, 2, 3, 4, 5].map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="rounded-2xl bg-primary px-6 py-4 font-bold"
              onClick={handleAddToCart}
              disabled={adding}
            >
              ADD TO BAG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
