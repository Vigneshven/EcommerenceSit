"use client";

import { createOrder, getCart } from "@/api/api";
import Button from "@/components/Button";
import OrderSummary from "@/components/OrderSummary";
import { cart } from "@/type/Cart";
import useAuthStore from "@/zustandStore/authStore";
import useShopStore from "@/zustandStore/ShopStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Skeleton from "react-loading-skeleton";
import { toast } from "sonner";
import z from "zod";

const shippingSchema = z.object({
  firstName: z.string().trim().min(3, "Enter at least 3 character"),
  address: z.string().trim().min(5, "Enter at least 5 characters"),
});

type shippingForm = z.infer<typeof shippingSchema>;

function Checkout() {
  const router = useRouter();

  const user = useAuthStore((state) => state.currentUser);
  const isGuest = useAuthStore((state) => state.isGuest);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const markCartChanged = useShopStore((state) => state.markCartChanged);

  const [cart, setCart] = useState<cart[]>([]);
  const [loading, setLoading] = useState(true);
  const [placeOrder, setPlaceOrder] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<shippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: "",
      address: "",
    },
  });

  const loadCart = useCallback(async () => {
    if (!hasHydrated) return;
    try {
      setLoading(true);

      if (user?.id) {
        const items = await getCart(user.id, false);
        setCart(items);
      } else if (isGuest) {
        const items = await getCart(undefined, true);
        setCart(items);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [user, hasHydrated, isGuest]);

  useEffect(() => {
    if (!hasHydrated) return;

    loadCart();
  }, [loadCart, hasHydrated]);

  const handlePlaceOrder = async (data: shippingForm) => {
    if (cart.length === 0) {
      toast.error("Your Cart is Empty");
      return;
    }
    setPlaceOrder(true);
    try {
      await createOrder(
        {
          name: data.firstName,
          address: data.address,
        },
        !user?.id && isGuest,
      );
      markCartChanged();
      setCart([]);
      toast.success("Order Placed Successfully...");
      router.push("/order");
    } catch (error) {
      console.log(error);
      toast.error("Failed to Place Order...");
    } finally {
      setPlaceOrder(false);
    }
  };

  if (!hasHydrated || loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <Skeleton height={40} width={250} className="mb-8" />

        <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
          <section className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex gap-5 border-b border-border pb-6"
              >
                <Skeleton width={128} height={128} borderRadius={12} />

                <div className="flex-1">
                  <Skeleton width="65%" height={24} />
                  <Skeleton width="35%" className="mt-3" />
                  <Skeleton width={90} height={36} className="mt-5" />
                </div>
              </div>
            ))}
          </section>

          <aside>
            <Skeleton height={300} borderRadius={16} />
          </aside>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Place Order</h1>
      {cart.length === 0 ? (
        <div className="rounded-2xl bg-primary-light p-8">
          <p className="mb-4">Your Cart is Empty</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(handlePlaceOrder)}>
          <div className="grid grid-8 lg:grid-cols-[1fr_22rem]">
            <section className="flex flex-col gap-10 justify-center">
              <h2 className="font-bold text-2xl">Shipping Information</h2>
              <div className="flex flex-col gap-10">
                <div className="flex flex-1 gap-10 items-center">
                  <label>First Name</label>
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      {...register("firstName")}
                      placeholder="Enter Your Name"
                      className="border-2 rounded h-10 border-primary-light w-76 "
                    />
                    {errors.firstName && (
                      <p className="text-red">{errors.firstName.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-10">
                  <div className="flex flex-1 gap-10 items-center">
                    <label>Address</label>
                    <div className="flex flex-col gap-1">
                      <input
                        type="text"
                        {...register("address")}
                        placeholder="Enter Address"
                        className="border-2 rounded h-10 border-primary-light w-76"
                      />
                      {errors.address && (
                        <p className="text-red">{errors.address.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <div className="flex flex-col gap-2">
              <OrderSummary cart={cart} loading={loading} />
              <Button type="submit" disabled={placeOrder} className="w-full">
                {placeOrder ? "Placing Order..." : "Place Your Order"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </main>
  );
}

export default Checkout;
