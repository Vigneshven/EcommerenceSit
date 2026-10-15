"use client";

import { useState } from "react";
import ColorSelector from "@/components/ColorSelector";
import { toast } from "sonner";
import type { Product } from "@/type/Product";
import useShopStore from "@/zustandStore/ShopStore";
import Image from "next/image";

type Props = {
  product: Product;
};

export default function ProductDetails({ product }: Props) {
  const [amount, setAmount] = useState("1");

  const addToCart = useShopStore((state) => state.addToCart);
  const selectedColor = useShopStore((state) => state.selectedColor);

  return (
    <div>

      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
          <div className="w-full md:w-1/2">
            <Image
              src={product.image}
              alt={product.name}
              className="h-96 w-full rounded-3xl border-8 border-primary-dark object-cover"
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
              onClick={() => {
                addToCart({
                  id: product.id,
                  image: product.image,
                  name: product.name,
                  company: product.company,
                  price: product.price,
                  amount: Number(amount),
                  color: selectedColor,
                });

                toast.success("Added to cart!");
              }}
            >
              ADD TO BAG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
