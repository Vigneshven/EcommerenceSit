import { Moon, ShoppingCart } from "lucide-react";
import NavBar from "./NavBar";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Link } from "react-router-dom";

export default function Header() {

    const cart = useSelector((state: RootState) => state.shop.cart)

    const cartAmount = cart.reduce((total, item) => total + item.amount, 0)

    return (
        <header className="w-full bg-primary-light">
            <div className="w-full max-w-7xl px-6 mx-auto flex h-15 items-center justify-between">
                <div className="w-11 rounded-2xl bg-blue-500 p-2 text-center text-2xl font-bold text-amber-50">
                    <p>V</p>
                </div>

                <div className="bg-primary-light">
                    <NavBar />
                </div>

                <div className="flex gap-6">
                    <Moon />
                    <Link className="relative inline-flex" to={"/cart"}><ShoppingCart />
                        {cartAmount > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center w-4 rounded-2xl bg-primary px-1 text-xs text-white">
                            {cartAmount}
                        </span>}
                    </Link>
                </div>


            </div>
        </header>
    )

}