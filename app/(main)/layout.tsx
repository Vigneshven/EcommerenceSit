import Header from "../../components/Header";
import Account from "../../components/Account";

import LayoutProps from "@/type/LayoutProps";


export default function MainLayout({
  children,
}: LayoutProps) {
  return (
    <>
      <Account />
      <Header />
      <main>{children}</main>
    </>
  );
}
