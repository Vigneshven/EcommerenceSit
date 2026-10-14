import { Moon, ShoppingCart, Sun } from "lucide-react";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";
import useThemeStore from "../zustandStore/themeStore";
import useShopStore from "../zustandStore/shopStore";
import useAuthStore from "../zustandStore/authStore";

export default function Header() {

  const carts = useShopStore((state) => state.cart);
  const user = useAuthStore((state) => state.currentUser);

  const cartKey = user ? `user:${user.email.toLowerCase()}` : "guest";

  const cart = carts[cartKey] ? carts[cartKey] : [];

  const cartAmount = cart.reduce((total, item) => total + item.amount, 0);

  const mode = useThemeStore((state) => state.mode);

  const toggleTheme = useThemeStore((state) => state.toggleTheme);

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
          <button type="button" onClick={toggleTheme} aria-label="Toggle theme">
            {mode === "light" ? (
              <Moon className="cursor-pointer" />
            ) : (
              <Sun className="cursor-pointer" />
            )}
          </button>
          <Link className="relative inline-flex" to={"/cart"}>
            <ShoppingCart />
            {cartAmount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center w-4 rounded-2xl bg-primary px-1 text-xs text-on-primary">
                {cartAmount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
