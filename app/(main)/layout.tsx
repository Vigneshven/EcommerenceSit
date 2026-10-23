import Header from "../../components/Header";
import Account from "../../components/Account";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Account />
      <Header />
      <>{children}</>
    </>
  );
} 
