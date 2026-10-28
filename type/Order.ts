export type CreateOrder = {
  name: string;
  address: string;
};

export type OrderProduct = {
  id: number;
  name: string;
  amount: number;
  price: string | number;
  color: string;
};

export type Order = {
  id: number;
  name: string;
  address: string;
  product: OrderProduct[];
  cost: number;
  dateTime: string;
};
