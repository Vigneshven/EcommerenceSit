import Header from "../../components/Header";
import Account from "../../components/Account";
import { Auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticate = await Auth();

  if (!isAuthenticate) {
    redirect("/");
  }

  return (
    <>
      <Account />
      <Header />
      <>{children}</>
    </>
  );
}
