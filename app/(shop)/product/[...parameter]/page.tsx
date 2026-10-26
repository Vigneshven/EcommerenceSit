import { notFound } from "next/navigation";
import ProductDetailsPage from "./ProductDetailPage";

export default async function Page({
  params,
}: PageProps<"/product/[...parameter]">) {
  const { parameter } = await params;

  const id = parameter[0];

  if (!id) {
    notFound();
  }

  return <ProductDetailsPage id={id} />;
}
