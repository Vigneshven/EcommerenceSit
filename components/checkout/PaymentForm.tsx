"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  PaymentElement,
  useCheckoutElements,
} from "@stripe/react-stripe-js/checkout";
import Button from "../Button";

type PaymentFormProps = {
  email: string;
  onPaymentSubmitted: () => void;
};

export function PaymentForm({ email, onPaymentSubmitted }: PaymentFormProps) {
  const result = useCheckoutElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  if (result.type === "loading") {
    return <p>Loading payment form...</p>;
  }
  if (result.type === "error") {
    return (
      <p className="text-red-500" role="alert">
        {result.error.message}
      </p>
    );
  }
  const { checkout } = result;
  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const confirmResult = await checkout.confirm({
        email,
        redirect: "if_required",
      });
      if (confirmResult.type === "error") {
        setErrorMessage(confirmResult.error.message);
        toast.error(confirmResult.error.message || "Payment failed");
        return;
      }

      onPaymentSubmitted();
      toast.info("Payment submitted.Waiting for confirmation...");
    } catch (error) {
      console.error(error);
      setErrorMessage("Payment could not be completed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-5">
      <PaymentElement
        options={{
          layout: "accordion",
          paymentMethodOrder: ["card"],
          wallets: {
            link: "never",
          },
          fields: {
            billingDetails: {
              email: "never",
            },
          },
        }}
      />

      {errorMessage && (
        <p className="text-sm text-red-500" role="alert">
          {errorMessage}
        </p>
      )}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-black px-5 py-3 text-white"
      >
        {isSubmitting ? "Processing Payment..." : "Pay now"}
      </Button>
    </form>
  );
}
