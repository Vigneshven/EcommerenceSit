"use client";

import useAuthStore from "@/zustandStore/authStore";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavBar() {
  const pathname = usePathname();

  const checkActive = (path: string) => pathname === path;

  const user = useAuthStore((state) => state.currentUser);

  const isGuest = useAuthStore((state) => state.isGuest);

  return (
    <div>
      <nav className="flex flex-1 gap-3">
        <Link
          href={"/"}
          className={`flex items-center justify-center ${checkActive("/") ? "w-17 bg-primary-dark text-primary-light p-1 rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`}
        >
          Home
        </Link>
        <Link
          href={"/about"}
          className={`flex items-center justify-center ${checkActive("/about") ? " w-17 bg-primary-dark text-primary-light p-1 rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`}
        >
          About
        </Link>
        <Link
          href={"/product"}
          className={`flex items-center justify-center ${checkActive("/product") ? " w-17 bg-primary-dark text-primary-light p-1 rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`}
        >
          Product
        </Link>
        <Link
          href={"/cart"}
          className={`flex items-center justify-center ${checkActive("/cart") ? " w-17 bg-primary-dark text-primary-light p-1  rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`}
        >
          Cart
        </Link>
        {(user || isGuest) && (
          <Link
            href={"/checkout"}
            className={`flex items-center justify-center ${checkActive("/checkout") ? "bg-primary-dark text-primary-light p-1  rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`}
          >
            Checkout
          </Link>
        )}
        {(user || isGuest) && (
          <Link
            href={"/order"}
            className={`flex items-center justify-center ${checkActive("/order") ? "bg-primary-dark text-primary-light p-1  rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`}
          >
            Order
          </Link>
        )}
      </nav>
    </div>
  );
}

export default NavBar;
