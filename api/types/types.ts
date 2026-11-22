export type CheckoutResponse = {
  orderId: number;
  clientSecret: string;
  sessionId: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
};
