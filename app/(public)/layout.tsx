import { Auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticate = await Auth();
  const cookieStore = await cookies();

  const isGuest = cookieStore.get("guest_id");

  if (isAuthenticate || isGuest) {
    redirect("/");
  }

  return <>{children}</>;
}
