import { Suspense } from "react";
import ProductDetailsPage from "./ProductDetailPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <p className="py-10 text-center text-xl">Loading Product Details...</p>
      }
    >
      <ProductDetailsPage params={params} />
    </Suspense>
  );
}
