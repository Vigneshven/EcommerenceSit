import ProductDetailsPage from "./ProductDetailPage";

export default async function Page({ params }: PageProps<"/product/[id]">) {
  const { id } = await params;
  return <ProductDetailsPage id={id} />;
}
