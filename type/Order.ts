export type CreateOrder = {
  name: string;
  address: string;
};

export type OrderProduct = {
  cartItemId: number;
  id: number;
  name: string;
  amount: number;
  price: number;
  color: string;
};

export type Order = {
  id: number;
  name: string;
  address: string;
  product: OrderProduct[];
  cost: number;
  dateTime: string;
  payment: {
    status: string;
    provider: string | null;
    transactionId: string | null;
    sessionId: string | null;
  };
  orderStatus: string;
};
