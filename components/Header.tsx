"use client";

import { Moon, ShoppingCart, Sun } from "lucide-react";
import NavBar from "./NavBar";
import Link from "next/link";
import useThemeStore from "@/zustandStore/themeStore";

function Header() {
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
          <button type="button" onClick={toggleTheme}>
            {mode === "light" ? (
              <Moon className="cursor-pointer" />
            ) : (
              <Sun className="cursor-pointer" />
            )}
          </button>
          <Link href={"/cart"}>
            <ShoppingCart />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
