import { getProducts } from "@/api/api";
import ProductFilterForm from "@/components/ProductFilterForm";
import ShowProduct from "@/components/ShowProduct";
import { parsePrice } from "@/lib/utils/price";

async function page() {
  const products = await getProducts();
  const MaxPrice = products.reduce(
    (max, product) => Math.max(max, parsePrice(product.price)),
    0,
  );
  const maxPrice = Math.ceil(MaxPrice / 1000) * 1000;
  const priceBounds = { minPrice: 0, maxPrice };

  return (
    <div>
      <div className="mx-auto mt-10 flex w-full max-w-7xl items-center justify-center gap-3 px-6">
        <ProductFilterForm priceBounds={priceBounds} />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6">
        <ShowProduct initialProducts={products} priceBounds={priceBounds} />
      </div>
    </div>
  );
}

export default page;
