export type PaymentOwner = {
  userId: number | null;
  guestId: string | null;
};

export type PaymentOrderProduct = {
  cartItemId: number;
  id: number;
  name: string;
  amount: number;
  price: number;
  color: string;
};
