import ProductFilterForm from "@/components/ProductFilterForm";
import ShowProduct from "@/components/ShowProduct";
import { getProducts } from "@/lib/Product";
import { Suspense } from "react";

async function page() {
  const products = await getProducts();
  return (
    <div>
      <div className="w-full max-w-7xl mx-auto px-6 mt-10 flex items-center justify-center gap-3">
        <Suspense fallback={<p>Loading Filters...</p>}>
          <ProductFilterForm />
        </Suspense>
      </div>

      <div className="w-full max-w-7xl px-6 mx-auto">
        <Suspense fallback={<p>Loading Products...</p>}>
          <ShowProduct initialProducts={products} />
        </Suspense>
      </div>
    </div>
  );
}

export default page;
