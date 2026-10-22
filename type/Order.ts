export type CreateOrder = {
  userd: number | null;
  name: string;
  address: string;
  product: {
    id: number;
    name: string;
    amount: number;
    price: string;
    color: string;
  }[];
  cost: number;
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
