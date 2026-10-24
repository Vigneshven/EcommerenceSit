import Header from "../../components/Header";
import Account from "../../components/Account";
import { Auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticate = await Auth();
  const cookieStore = await cookies();
  const isGuest = cookieStore.get("guestMode")?.value === "true";

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
