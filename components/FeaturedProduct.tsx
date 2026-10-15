"use client";

import { useEffect, useState } from "react";
import { BASE_URL } from "./api/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  id: number;
  image: string;
  name: string;
  company: string;
  category: "kids" | "beds" | "sofa" | "chairs";
  free_shipping: boolean;
  price: string;
  description: string;
  amount: "1" | "2" | "3" | "4" | "5";
}

function FeaturedProduct() {
  const [product, setProduct] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const products = async () => {
      try {
        const res = await fetch(`${BASE_URL}/products`);

        if (!res.ok) throw new Error("fail to fetch");

        const data: Product[] = await res.json();
        setProduct(data);
      } catch {
        setError("unable to load product");
      } finally {
        setLoading(false);
      }
    };
    products();
  }, []);

  if (loading) {
    return <p>Product loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const FeaturedProduct = product.slice(0, 8);

  const handleProductClick = (id: number): void => {
    router.push(`/products/${id}`);
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <h2 className="self-start font-sans text-2xl">Featured Products</h2>

      <hr className="w-full border-primary-light border-t-2" />

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FeaturedProduct.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            className="cursor-pointer overflow-hidden rounded-xl border border-border bg-card-background shadow transition hover:bg-hover-background hover:shadow-lg"
          >
            <Image
              className="h-56 w-full object-cover"
              src={product.image}
              alt={product.name}
              width={700}
              height={400}
            />

            <div className="flex flex-col items-center justify-center p-4">
              <h2 className="text-lg font-semibold text-heading">
                {product.name}
              </h2>

              <span className="mt-2 block font-medium text-primary">
                ₹{product.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedProduct;
