import { getProducts } from "@/api/api";
import ProductFilterForm from "@/components/ProductFilterForm";
import ShowProduct from "@/components/ShowProduct";
import { Suspense } from "react";

async function page() {
  const products = await getProducts();
  return (
    <div>
      <div className="w-full max-w-7xl mx-auto px-6 mt-10 flex items-center justify-center gap-3">
        <ProductFilterForm />
      </div>

      <div className="w-full max-w-7xl px-6 mx-auto">
        <ShowProduct initialProducts={products} />
      </div>
    </div>
  );
}

export default page;
