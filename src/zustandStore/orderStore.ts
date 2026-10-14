import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Order = {
  id: string;
  name: string;
  address: string;
  products: string[];
  cost: number;
  dateTime: string;
};

type OrderState = {
  orders: Order[];
  addOrder: (order: Order) => void;
};

const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],

      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order],
        })),
    }),
    {
      name: "order-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useOrderStore;
