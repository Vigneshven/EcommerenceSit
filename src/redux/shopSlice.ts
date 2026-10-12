import { createSlice, type PayloadAction } from "@reduxjs/toolkit"


export type CartItem = {
    id: number
    image: string
    name: string
    company: string
    price: string
    amount: number
    color: string
}

type ShopState = {
    cart: CartItem[],
    selectedColor:string
}


const initialState: ShopState = {
    cart: [],
    selectedColor:"pink"
}

const ShopSlice = createSlice({
    name: "Shop",
    initialState,
    reducers: {
        setSelectedColor:(state,action:PayloadAction<string>)=>{
            state.selectedColor = action.payload;
        },
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.cart.find((item) => item.id === action.payload.id)

            if (existingItem) {
                existingItem.amount = Math.min(5, existingItem.amount + action.payload.amount)
            } else {
                state.cart.push({ ...action.payload, amount: Math.min(5, Math.max(1, action.payload.amount)) })
            }
        },
        updateCartAmount: (state, action: PayloadAction<{ id: number; amount: number }>) => {
            const item = state.cart.find((cartItem) => cartItem.id === action.payload.id)
            if (item) item.amount = Math.max(1, action.payload.amount)
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.cart = state.cart.filter((item) => item.id !== action.payload)
        },
    }
})

export const { addToCart, updateCartAmount, removeFromCart,setSelectedColor } = ShopSlice.actions
export default ShopSlice.reducer

