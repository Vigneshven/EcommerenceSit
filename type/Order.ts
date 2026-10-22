export type CreateOrder = {
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
