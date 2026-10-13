import { Moon, ShoppingCart, Sun } from "lucide-react";
import NavBar from "./NavBar";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { Link } from "react-router-dom";
import { toggleTheme } from "../redux/themeSlice";

export default function Header() {

    const cart = useSelector((state: RootState) => state.shop.cart)

    const cartAmount = cart.reduce((total, item) => total + item.amount, 0)

    const dispatch = useDispatch<AppDispatch>()

    const mode = useSelector((state: RootState) => state.theme.mode)

    return (
        <header className="w-full bg-header-background text-header-text">
            <div className="w-full max-w-7xl px-6 mx-auto flex h-15 items-center justify-between">
                <div className="w-11 rounded-2xl bg-primary p-2 text-center text-2xl font-bold text-on-primary">
                    <p>V</p>
                </div>

                <div>
                    <NavBar />
                </div>

                <div className="flex gap-6">
                    <button
                        type="button"
                        onClick={() => dispatch(toggleTheme())}
                        aria-label="Toggle theme"
                    >
                        {mode === "light" ? (
                            <Moon className="cursor-pointer" />
                        ) : (
                            <Sun className="cursor-pointer" />
                        )}
                    </button>
                    <Link className="relative inline-flex" to={"/cart"}><ShoppingCart />
                        {cartAmount > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center w-4 rounded-2xl bg-primary px-1 text-xs text-on-primary">
                            {cartAmount}
                        </span>}
                    </Link>
                </div>


            </div>
        </header>
    )

}
