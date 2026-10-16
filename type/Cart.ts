export type cart = {
  id: number;
  user_id: number;
  product_id: number | null;
  name: string;
  company: string | null;
  image: string | null;
  color: string | null;
  price: string;
  amount: number;
};
