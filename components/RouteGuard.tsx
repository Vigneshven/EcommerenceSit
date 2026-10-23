"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/zustandStore/authStore";

type Props = {
  children: React.ReactNode;
  type: "protected" | "public";
  allowGuest: boolean;
};

export default function RouteGuard({
  children,
  type,
  allowGuest = false,
}: Props) {
  const router = useRouter();

  const user = useAuthStore((state) => state.currentUser);
  const isGuest = useAuthStore((state) => state.isGuest);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const allowed = !!user || (allowGuest && isGuest);

  useEffect(() => {
    if (!hasHydrated) return;

    if (type === "protected" && !allowed) {
      router.replace("/login");
    }

    if (type === "public" && user) {
      router.replace("/");
    }
  }, [hasHydrated, allowed, user, type, router]);

  if (!hasHydrated) return null;

  if (type === "protected" && !allowed) return null;
  if (type === "public" && user) return null;

  return children;
}
