export type cart = {
  cartItemId: number;
  user_id: number;
  product_id: number | null;
  name: string;
  company: string | null;
  image: string;
  color: string | null;
  price: string;
  amount: number;
};
