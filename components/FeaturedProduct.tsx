import { getProducts } from "@/lib/Product";
import Image from "next/image";
import Link from "next/link";


export default async function FeaturedProduct() {
  const products = await getProducts();

  const FeaturedProduct = products.slice(0, 8);

  return (
    <div className="flex w-full flex-col gap-5">
      <h2 className="self-start font-sans text-2xl">Featured Products</h2>

      <hr className="w-full border-primary-light border-t-2" />

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FeaturedProduct.map((product) => (
          <Link
            href={`/product/${product.id}`}
            key={product.id}
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
          </Link>
        ))}
      </div>
    </div>
  );
}
