export type CheckoutResponse = {
  clientSecret: string;
  sessionId: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
};
