"use client";

import useAuthStore from "@/zustandStore/authStore";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavBar() {
  const pathname = usePathname();

  const checkActive = (path: string) => pathname === path;

  const user = useAuthStore((state) => state.currentUser);

  return (
    <div>
      <nav className="flex flex-1 gap-3">
        <Link
          href={"/"}
          className={`${checkActive("/") ? "bg-primary-dark text-primary-light p-1  rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`}
        >
          Home
        </Link>
        <Link
          href={"/about"}
          className={`${checkActive("/about") ? "bg-primary-dark text-primary-light p-1  rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`}
        >
          About
        </Link>
        <Link
          href={"/product"}
          className={`${checkActive("/product") ? "bg-primary-dark text-primary-light p-1  rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`}
        >
          Product
        </Link>
        <Link
          href={"/cart"}
          className={`${checkActive("/cart") ? "bg-primary-dark text-primary-light p-1  rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`}
        >
          Cart
        </Link>
        {user && (
          <Link
            href={"/checkout"}
            className={`${checkActive("/checkout") ? "bg-primary-dark text-primary-light p-1  rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`}
          >
            Checkout
          </Link>
        )}
        {user && (
          <Link
            href={"/order"}
            className={`${checkActive("/order") ? "bg-primary-dark text-primary-light p-1  rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`}
          >
            Order
          </Link>
        )}
      </nav>
    </div>
  );
}

export default NavBar;
