import "server-only";

export interface Product {
  id: number;
  image: string;
  name: string;
  company: string;
  category: "kids" | "beds" | "sofa" | "chairs";
  free_shipping: boolean;
  price: string;
  description: string;
  amount: "1" | "2" | "3" | "4" | "5";
}
