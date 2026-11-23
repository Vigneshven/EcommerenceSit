"use client";

import {
  createPayoutCheckout,
  getCart,
  getOrders,
  getPendingCheckouts,
  PendingCheckout,
} from "@/api/api";
import Button from "@/components/Button";
import StripePaymentForm from "@/components/checkout/StripePaymentForm";
import OrderSummary from "@/components/OrderSummary";
import { cart } from "@/type/Cart";
import useAuthStore from "@/zustandStore/authStore";
import usePaymentStore from "@/zustandStore/PaymentStore";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const [pendingCheckouts, setPendingCheckouts] = useState<PendingCheckout[]>(
    [],
  );

  const {
    pendingSessionId,
    paymentSubmitted,
    paymentConfirmed,
    setPendingPayment,
    confirmPayment,
    clearPayment,
    markPaymentSubmitted,
  } = usePaymentStore();

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
          confirmPayment();
          toast.success("Payment confirmed successfully!");
          router.replace("/order");
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
  }, [
    paymentSubmitted,
    pendingSessionId,
    user?.id,
    isGuest,
    confirmPayment,
    router,
  ]);

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
    if (paymentConfirmed && cart.length > 0) {
      clearPayment();
    }
  }, [paymentConfirmed, cart.length, clearPayment]);

  useEffect(() => {
    if (!hasHydrated) return;

    loadCart();
  }, [loadCart, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated || (!user?.id && !isGuest)) return;

    void getPendingCheckouts(isGuest)
      .then(setPendingCheckouts)
      .catch((error) => console.log(error));
  }, [hasHydrated, isGuest, user?.id]);

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
      setPendingPayment(response.sessionId, {
        firstName: data.firstName,
        email: data.email,
        address: data.address,
      });
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
            {!clientSecret && !paymentConfirmed && (
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
            {pendingCheckouts.length > 0 && (
              <section className="rounded-2xl border border-yellow-300 bg-yellow-50 p-5">
                <h2 className="text-xl font-bold text-yellow-900">
                  Pending Payments
                </h2>
                <div className="mt-4 space-y-3">
                  {pendingCheckouts.map((checkout) => (
                    <div
                      key={checkout.sessionId}
                      className="rounded-xl border border-yellow-200 bg-white p-4 text-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">Payment Pending</p>
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold uppercase text-yellow-800">
                          {checkout.status}
                        </span>
                      </div>
                      <p className="mt-2">Name: {checkout.name}</p>
                      <p>Total: ₹{checkout.cost}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </section>
          <aside className="flex flex-col gap-6">
            <OrderSummary cart={cart} loading={loading} />
            {clientSecret && !paymentSubmitted && (
              <section className="space-y-5">
                <h2 className="text-2xl font-bold">Payment Information</h2>
                <StripePaymentForm
                  clientSecret={clientSecret}
                  email={paymentEmail}
                  onPaymentSubmitted={markPaymentSubmitted}
                />
                <Button
                  type="button"
                  onClick={() => {
                    setClientSecret(null);
                    setPaymentEmail("");
                    clearPayment();
                  }}
                  className="text-sm underline"
                >
                  Back to Shipping Information
                </Button>
              </section>
            )}
            {paymentSubmitted && !paymentConfirmed && (
              <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-6 text-center">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-yellow-500" />
                  <h2 className="font-semibold text-yellow-800">
                    Payment Pending
                  </h2>
                </div>
                <p className="mt-3 text-sm text-yellow-800">
                  Your payment is being processed. Please wait.
                </p>
                <p className="text-sm text-yellow-800">
                  Your order will appear after Stripe confirms payment.
                </p>
              </div>
            )}
            {paymentConfirmed && (
              <div className="rounded-xl border border-green-300 bg-green-50 p-6 text-center">
                <h3 className="font-semibold text-green-800">
                  Payment Confirmed
                </h3>
                <p className="mt-3 text-sm text-green-800">
                  Your payment has been confirmed successfully.
                </p>
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}

export default Checkout;
