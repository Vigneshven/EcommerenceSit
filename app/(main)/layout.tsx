import Header from "../../components/Header";
import Account from "../../components/Account";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Account />
      <main>{children}</main>
    </>
  );
}
