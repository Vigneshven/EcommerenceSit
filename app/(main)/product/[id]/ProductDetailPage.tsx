import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { getProductById } from "@/api/api";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ id }: Props) {
  const product = await getProductById(id);

  if (!product) notFound();

  return <ProductDetails product={product} />;
}
