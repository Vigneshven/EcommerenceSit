import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ShippingInfo = {
  firstName: string;
  email: string;
  address: string;
};

type PaymentState = {
  pendingSessionId: string | null;
  shippingInfo: ShippingInfo | null;
  paymentSubmitted: boolean;
  paymentConfirmed: boolean;

  setPendingPayment: (sessionId: string, shippingInfo: ShippingInfo) => void;
  markPaymentSubmitted: () => void;
  confirmPayment: () => void;
  clearPayment: () => void;
};

const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      pendingSessionId: null,
      paymentSubmitted: false,
      paymentConfirmed: false,
      shippingInfo: null,

      setPendingPayment: (sessionId, shippingInfo) =>
        set({
          pendingSessionId: sessionId,
          shippingInfo,
          paymentSubmitted: false,
          paymentConfirmed: false,
        }),

      markPaymentSubmitted: () =>
        set({
          paymentSubmitted: true,
        }),

      confirmPayment: () =>
        set({
          paymentSubmitted: false,
          paymentConfirmed: true,
        }),

      clearPayment: () =>
        set({
          pendingSessionId: null,
          shippingInfo: null,
          paymentSubmitted: false,
          paymentConfirmed: false,
        }),
    }),
    {
      name: "payment-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default usePaymentStore;
