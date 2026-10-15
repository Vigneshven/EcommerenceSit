import { getProductById } from "@/lib/Product";
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return <ProductDetails product={product} />;
}
