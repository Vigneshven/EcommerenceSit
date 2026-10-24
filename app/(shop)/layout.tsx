import Account from "@/components/Account";
import Header from "@/components/Header";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Account />
      <Header />
      <>{children}</>
    </>
  );
}
