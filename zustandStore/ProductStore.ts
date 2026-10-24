import { Product } from "@/type/Product";
import { create } from "zustand";

type ProductState = {
  product: Product[];
  setProducts: (products: Product[]) => void;
};

const useProductStore = create<ProductState>((set) => ({
  product: [],
  setProducts: (products) => set({ products }),
}));

export default useProductStore;
