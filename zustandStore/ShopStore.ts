import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import useAuthStore from "./authStore";

export type CartItem = {
  id: number;
  cartItemId?: number;
  product_id?: number | null;
  image: string;
  name: string;
  company: string;
  price: string;
  amount: number;
  color: string;
};

type ShopState = {
  cart: Record<string, CartItem[]>;
  cartVersion: number;
  addAnonymousCartItem: (item: CartItem) => void;
  selectedColor: string;

  setSelectedColor: (color: string) => void;
  markCartChanged: () => void;
  addToCart: (item: CartItem) => void;
  updateCartAmount: (payload: { id: number; amount: number }) => void;
  removeFromCart: (id: number) => void;
};

const getkey = () => {
  const auth = useAuthStore.getState();

  if (auth.currentUser) {
    return `user:${auth.currentUser.email.toLowerCase()}`;
  }

  if (auth.isGuest) {
    return "guest";
  }

  return "anonymous";
};

const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      cart: { guest: [] },
      cartVersion: 0,
      selectedColor: "pink",

      setSelectedColor: (color) => set({ selectedColor: color }),
      markCartChanged: () =>
        set((state) => ({ cartVersion: state.cartVersion + 1 })),

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

      addAnonymousCartItem: (newItem) =>
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
