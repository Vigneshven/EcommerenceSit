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
          className={`flex w-24 shrink-0 items-center justify-center rounded p-1 text-center ${
            checkActive("/")
              ? "bg-primary-dark text-primary-light dark:text-amber-50"
              : "text-header-text hover:bg-hover-background"
          }`}
        >
          Home
        </Link>
        <Link
          href={"/about"}
          className={`flex min-w-20 items-center justify-center rounded p-1 text-center ${checkActive("/about") ? "bg-primary-dark text-primary-light p-1 rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`}
        >
          About
        </Link>
        <Link
          href={"/product"}
          className={`flex min-w-20 items-center justify-center rounded p-1 text-center ${checkActive("/product") ? "bg-primary-dark text-primary-light p-1  rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`}
        >
          Product
        </Link>
        <Link
          href={"/cart"}
          className={`flex min-w-20 items-center justify-center rounded p-1 text-center ${checkActive("/cart") ? "bg-primary-dark text-primary-light p-1  rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`}
        >
          Cart
        </Link>
        {(user || isGuest) && (
          <Link
            href={"/checkout"}
            className={`flex min-w-20 items-center justify-center rounded p-1 text-center ${checkActive("/checkout") ? "bg-primary-dark text-primary-light p-1  rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`}
          >
            Checkout
          </Link>
        )}
        {(user || isGuest) && (
          <Link
            href={"/order"}
            className={`flex min-w-20 items-center justify-center rounded p-1 text-center ${checkActive("/order") ? "bg-primary-dark text-primary-light p-1  rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`}
          >
            Order
          </Link>
        )}
      </nav>
    </div>
  );
}

export default NavBar;
