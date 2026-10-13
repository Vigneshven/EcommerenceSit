import { useDispatch, useSelector } from "react-redux"
import Account from "./Account"
import Header from "./Header"
import type { AppDispatch, RootState } from "../redux/store"
import { removeFromCart, updateCartAmount } from "../redux/shopSlice"
import { useState } from "react"

const SHIPPING = 15
const TAX_RATE = 0.1

function priceToNumber(price: string) {
    const value = Number.parseFloat(price.replace(/[^\d.-]/g, ""))
    return Number.isFinite(value) ? value : 0
}

function formatPrice(value: number) {
    return value.toLocaleString("en-US", { style: "currency", currency: "USD" })
}

function Cart() {
    const dispatch = useDispatch<AppDispatch>()
    const cart = useSelector((state: RootState) => state.shop.cart)
    const subtotal = cart.reduce((total, item) => total + priceToNumber(item.price) * item.amount, 0)
    const shipping = subtotal === 0 || subtotal >= 1000 ? 0 : SHIPPING
    const tax = subtotal * TAX_RATE
    const orderTotal = subtotal + shipping + tax

    const [maxAmount, setMaxAmount] = useState(8);

    return (
        <div>
            <Account />
            <Header />
            <main className="mx-auto w-full max-w-7xl px-6 py-12">
                <h1 className="mb-8 border-b border-border pb-6 text-3xl font-bold text-heading">Shopping Cart</h1>
                {cart.length === 0 ? (
                    <div className="border-t-2 border-primary-light pt-8">
                        <h2 className="text-2xl text-text-light">Your cart is empty</h2>
                    </div>
                ) : (
                    <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
                        <section className="space-y-6" aria-label="Cart items">
                            {cart.map((item) => (
                                <article key={item.id} className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-center">
                                    <img className="h-28 w-32 rounded-xl object-cover" src={item.image} alt={item.name} />
                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-lg font-semibold text-text-light">{item.name}</h2>
                                        <p className="text-muted-text">{item.company}</p>
                                        <div className="flex items-center gap-2">
                                            <span>Color:</span>

                                            <span
                                                className="h-5 w-5 rounded-full border border-border"
                                                style={{ backgroundColor: item.color }}
                                                title={item.color}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center mr-40 items-center gap-2">
                                        <label className="font-medium text-heading" htmlFor={`amount-${item.id}`}>Amount</label>
                                        <select
                                            id={`amount-${item.id}`}
                                            value={item.amount}
                                            onChange={(e) => {
                                                const amount = Number(e.target.value);

                                                dispatch(updateCartAmount({ id: item.id, amount }));

                                                if (amount === maxAmount) {
                                                    setMaxAmount(maxAmount + 5);
                                                }
                                            }}
                                            className="h-10 w-15 rounded-lg border border-border bg-input-background p-2 text-heading"
                                        >
                                            {Array.from({ length: maxAmount }, (_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    {i + 1}
                                                </option>
                                            ))}
                                        </select>
                                        <button type="button" onClick={() => dispatch(removeFromCart(item.id))} className="text-sm  text-primary hover:underline">remove</button>
                                    </div>
                                    <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end">
                                        
                                    </div>
                                    <p className="font-semibold text-heading">{formatPrice(priceToNumber(item.price) * item.amount)}</p>
                                </article>
                            ))}
                        </section>
                        <aside className="h-fit rounded-xl bg-primary-light p-6">
                            <h2 className="mb-5 text-xl font-bold text-heading">Order Summary</h2>
                            <div className="space-y-3 text-text-light">
                                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
                                <div className="flex justify-between"><span>Tax</span><span>{formatPrice(tax)}</span></div>
                                <div className="my-4 border-t border-border" />
                                <div className="flex justify-between text-lg font-bold"><span>Order Total</span><span>{formatPrice(orderTotal)}</span></div>
                            </div>
                            <button type="button" className="mt-6 w-full rounded-lg bg-primary px-4 py-3 font-bold text-on-primary hover:opacity-90">Please Login</button>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    )
}

export default Cart
