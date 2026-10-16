import Header from "../../components/Header";
import Account from "../../components/Account";

import LayoutProps from "@/type/LayoutProps";


export default function MainLayout({
  children,
}: LayoutProps) {
  return (
    <>
      <Header />
      <Account />
      <main>{children}</main>
    </>
  );
}
