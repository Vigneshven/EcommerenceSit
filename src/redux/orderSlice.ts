import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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
};

const initialState: OrderState = {
  orders: [],
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
  },
});

export const { addOrder } = orderSlice.actions;
export default orderSlice.reducer;
