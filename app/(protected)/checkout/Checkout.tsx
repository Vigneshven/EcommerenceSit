"use client";

import { createPayoutCheckout, getCart, getOrders } from "@/api/api";
import Button from "@/components/Button";
import StripePaymentForm from "@/components/checkout/StripePaymentForm";
import OrderSummary from "@/components/OrderSummary";
import { cart } from "@/type/Cart";
import useAuthStore from "@/zustandStore/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CheckCircle2, LoaderCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Skeleton from "react-loading-skeleton";
import { toast } from "sonner";
import z from "zod";

const shippingSchema = z.object({
  firstName: z.string().trim().min(3, "Enter at least 3 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  address: z.string().trim().min(5, "Enter at least 5 characters"),
});

type ShippingForm = z.infer<typeof shippingSchema>;

function Checkout() {
  const router = useRouter();
  const user = useAuthStore((state) => state.currentUser);
  const isGuest = useAuthStore((state) => state.isGuest);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const [cart, setCart] = useState<cart[]>([]);
  const [loading, setLoading] = useState(true);
  const [placeOrder, setPlaceOrder] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentEmail, setPaymentEmail] = useState("");
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: "",
      email: "",
      address: "",
    },
  });
  useEffect(() => {
    if (user?.email) {
      setValue("email", user.email);
    }
  }, [user?.email, setValue]);

  useEffect(() => {
    if (!paymentSubmitted || pendingSessionId === null) return;

    let checking = false;
    let active = true;

    const checkPaymentStatus = async () => {
      if (checking || !active) return;

      checking = true;

      try {
        const orders = await getOrders(user?.id, isGuest);

        const currentOrder = orders.find(
          (order) => order.payment.sessionId === pendingSessionId,
        );

        if (currentOrder?.payment?.status?.toLowerCase() === "paid") {
          setPaymentConfirmed(true);
          toast.success("Payment confirmed successfully!");
        }
      } catch (error) {
        console.log(error);
      } finally {
        checking = false;
      }
    };
    void checkPaymentStatus();

    const interval = setInterval(() => {
      void checkPaymentStatus();
    }, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [paymentSubmitted, pendingSessionId, user?.id, isGuest, router]);

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
      toast.error("Unable to load your cart");
    } finally {
      setLoading(false);
    }
  }, [user, hasHydrated, isGuest]);

  useEffect(() => {
    if (!hasHydrated) return;

    loadCart();
  }, [loadCart, hasHydrated]);

  const handlePlaceOrder = async (data: ShippingForm) => {
    if (cart.length === 0) {
      toast.error("Your Cart is Empty");
      return;
    }
    setPlaceOrder(true);
    try {
      const response = await createPayoutCheckout(
        data.firstName,
        data.address,
        isGuest,
      );
      if (!response.clientSecret) {
        throw new Error("Stripe client secret was not returned");
      }
      setPendingSessionId(response.sessionId);
      setPaymentEmail(data.email.trim());
      setClientSecret(response.clientSecret);
      toast.success("Payment form is ready");
    } catch (error) {
      console.error(error);
      toast.error("Failed to prepare checkout");
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
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
          <section className="flex flex-col gap-8">
            {!clientSecret && !paymentConfirmed && !paymentSubmitted && (
              <form
                onSubmit={handleSubmit(handlePlaceOrder)}
                className="flex flex-col gap-8"
              >
                <h2 className="text-2xl font-bold">Shipping Information</h2>

                <div className="flex flex-col gap-2">
                  <label>First Name</label>
                  <input
                    {...register("firstName")}
                    placeholder="Enter Your Name"
                    className="h-10 rounded border-2 border-primary-light px-3"
                  />
                  {errors.firstName && (
                    <p className="text-red-500">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label>Email Address</label>
                  <input
                    {...register("email")}
                    placeholder="Enter Your Email"
                    className="h-10 rounded border-2 border-primary-light px-3"
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label>Address</label>
                  <input
                    {...register("address")}
                    placeholder="Enter Address"
                    className="h-10 rounded border-2 border-primary-light px-3"
                  />
                  {errors.address && (
                    <p className="text-red-500">{errors.address.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={placeOrder}
                  className="rounded-md bg-black px-5 py-3 text-white"
                >
                  {placeOrder ? "Preparing Payment..." : "Continue to Payment"}
                </Button>
              </form>
            )}
            {clientSecret && !paymentSubmitted && (
              <section className="space-y-5">
                <h2 className="text-2xl font-bold">Payment Information</h2>

                <StripePaymentForm
                  clientSecret={clientSecret}
                  email={paymentEmail}
                  onPaymentSubmitted={() => setPaymentSubmitted(true)}
                />

                <Button
                  type="button"
                  onClick={() => {
                    setClientSecret(null);
                    setPaymentEmail("");
                    setPendingSessionId(null);
                    setPaymentSubmitted(false);
                    setPaymentConfirmed(false);
                  }}
                  className="text-sm underline"
                >
                  Back to Shipping Information
                </Button>
              </section>
            )}
            {paymentSubmitted && !paymentConfirmed && (
              <div className="flex min-h-105 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
                <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-full bg-yellow-100 opacity-60" />
                  <div className="absolute inset-2 animate-pulse rounded-full bg-yellow-100" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50">
                    <LoaderCircle className="h-9 w-9 animate-spin text-yellow-500" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Processing Your Payment
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                  Please wait while we securely verify your payment. This may
                  take a few moments.
                </p>
                <div className="mt-8 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-1/3 animate-[progress_2s_ease-in-out_infinite] rounded-full bg-yellow-500" />
                </div>
                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-yellow-600">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
                  Verifying payment with Stripe...
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  Please don`t close or refresh this checkout page.
                </p>
              </div>
            )}
            {paymentConfirmed && (
              <div className="flex min-h-105 flex-col items-center justify-center rounded-2xl border border-green-200 bg-white px-6 py-12 text-center shadow-sm">
                <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-full bg-green-100 opacity-50" />
                  <div className="absolute inset-3 rounded-full bg-green-100 animate-pulse" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-200">
                    <Check
                      className="h-12 w-12 animate-[checkPop_0.5s_ease-out_forwards] text-white"
                      strokeWidth={4}
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Order Confirmed!
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                  Your payment was successful and your order has been confirmed.
                  Thank you for shopping with us!
                </p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                  <CheckCircle2 size={16} />
                  Payment Successful
                </div>
                <Link
                  href="/product"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-black px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800"
                >
                  <ShoppingBag size={18} />
                  Continue Shopping
                </Link>
              </div>
            )}
          </section>
          <aside>
            <OrderSummary cart={cart} loading={loading} />
          </aside>
        </div>
      )}
    </main>
  );
}

export default Checkout;
