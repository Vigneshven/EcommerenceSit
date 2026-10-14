import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import useAuthStore from "./authStore";

export type CartItem = {
  id: number;
  image: string;
  name: string;
  company: string;
  price: string;
  amount: number;
  color: string;
};

type ShopState = {
  cart: Record<string, CartItem[]>;
  selectedColor: string;

  setSelectedColor: (color: string) => void;
  addToCart: (item: CartItem) => void;
  updateCartAmount: (payload: { id: number; amount: number }) => void;
  removeFromCart: (id: number) => void;
};

const getkey = () => {
  const user = useAuthStore.getState().currentUser;
  return user ? `user:${user.email.toLowerCase()}` : "guest";
};

const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      cart: { guest: [] },
      selectedColor: "pink",

      setSelectedColor: (color) => set({ selectedColor: color }),

      addToCart: (newItem) =>
        set((state) => {
          const key = getkey();
          const userCart = state.cart[key] ? state.cart[key] : [];
          const existingItem = userCart.find((item) => item.id === newItem.id);

          const updatedCart = existingItem
            ? userCart.map((item) =>
                item.id === newItem.id
                  ? {
                      ...item,
                      amount: Math.min(5, item.amount + newItem.amount),
                    }
                  : item,
              )
            : [
                ...userCart,
                {
                  ...newItem,
                  amount: Math.min(5, Math.max(1, newItem.amount)),
                },
              ];

          return {
            cart: {
              ...state.cart,
              [key]: updatedCart,
            },
          };
        }),

      updateCartAmount: ({ id, amount }) =>
        set((state) => {
          const key = getkey();
          const userCart = state.cart[key] ? state.cart[key] : [];

          return {
            cart: {
              ...state.cart,
              [key]: userCart.map((item) =>
                item.id === id ? { ...item, amount } : item,
              ),
            },
          };
        }),

      removeFromCart: (id) =>
        set((state) => {
          const key = getkey();
          const userCart = state.cart[key] ? state.cart[key] : [];

          return {
            cart: {
              ...state.cart,
              [key]: userCart.filter((item) => item.id !== id),
            },
          };
        }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useShopStore;
