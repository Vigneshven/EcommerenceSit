"use client";

import { CheckoutElementsProvider } from "@stripe/react-stripe-js/checkout";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentForm } from "./PaymentForm";

type StripePaymentFormProps = {
  clientSecret: string;
  email: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function StripePaymentForm({
  clientSecret,
  email,
}: StripePaymentFormProps) {
  return (
    <CheckoutElementsProvider
      stripe={stripePromise}
      options={{
        clientSecret,
        elementsOptions: {
          appearance: {
            theme: "stripe",
          },
        },
      }}
    >
      <PaymentForm email={email} />
    </CheckoutElementsProvider>
  );
}
