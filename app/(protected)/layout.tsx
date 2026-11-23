import { Auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Account from "@/components/Account";
import Header from "@/components/Header";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticate = await Auth();
  const cookieStore = await cookies();
  const isGuest = cookieStore.get("guest_session");

  if (!isAuthenticate && !isGuest) {
    redirect("/login");
  }

  return (
    <>
      <Account />
      <Header />
      <>{children}</>
    </>
  );
}
