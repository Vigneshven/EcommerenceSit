"use client";

import useAuthStore from "@/zustandStore/authStore";
import { useRouter } from "next/navigation";
import z from "zod";

const shippingSchema = z.object({
  firstName: z.string().trim().min(3, "Enter at least 3 character"),
  address: z.string().trim().min(5, "Enter at least 5 characters"),
});

type shippingForm = z.infer<typeof shippingSchema>;

function Checkout() {
  const router = useRouter();

  const user = useAuthStore((state) => state.currentUser);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const userId = user?.id;

  const guestId = !userId;

  return <div>Checkout</div>;
}

export default Checkout;
