"use client";

import { Moon, ShoppingCart, Sun } from "lucide-react";
import NavBar from "./NavBar";
import Link from "next/link";
import useThemeStore from "@/zustandStore/themeStore";
import useAuthStore from "@/zustandStore/authStore";
import useShopStore from "@/zustandStore/ShopStore";
import { cart as CartItem } from "@/type/Cart";
import { useEffect, useState } from "react";
import { getCart } from "@/api/api";

const emptyCart: CartItem[] = [];

function Header() {
  const mode = useThemeStore((state) => state.mode);

  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const user = useAuthStore((state) => state.currentUser);
  const guest = useAuthStore((state) => state.isGuest);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const cartVersion = useShopStore((state) => state.cartVersion);

  const anonymous = useShopStore(
    (state) => state.cart["anonymous"] ?? emptyCart,
  );

  const [dbCart, setDbCart] = useState<CartItem[]>([]);
  const [dbCartOwner, setDbCartOwner] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!user && !guest) {
      return;
    }

    let active = true;
    const owner = user ? `user:${user.id}` : "guest";

    getCart(user?.id, guest)
      .then((items) => {
        if (active) {
          setDbCart(items);
          setDbCartOwner(owner);
        }
      })
      .catch(console.error);

    return () => {
      active = false;
    };
  }, [user, guest, hasHydrated, cartVersion]);

  const owner = user ? `user:${user.id}` : guest ? "guest" : "anonymous";
  const cartForCount =
    owner === "anonymous"
      ? anonymous
      : owner === dbCartOwner
        ? dbCart
        : emptyCart;

  const cartAmount = cartForCount.reduce(
    (total, item) => total + Number(item.amount || 0),
    0,
  );

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
          <button type="button" onClick={toggleTheme}>
            {mode === "light" ? (
              <Moon className="cursor-pointer" />
            ) : (
              <Sun className="cursor-pointer" />
            )}
          </button>
          <Link href={"/cart"} className="relative inline-flex">
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

export default Header;
