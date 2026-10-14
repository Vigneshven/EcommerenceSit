import { NavLink } from "react-router-dom";
import useAuthStore from "../zustandStore/authStore";

function NavBar() {

  const user = useAuthStore((state) => state.currentUser);

  return (
    <div>
      <nav className="flex flex-1 gap-4">
        <NavLink
          className={({ isActive }) =>
            `rounded-lg p-1 ${isActive ? "bg-primary-dark text-primary-light p-1  rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`
          }
          to={"/"}
        >
          Home
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `rounded-lg p-1 ${isActive ? "bg-primary-dark  text-primary-light p-1  rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`
          }
          to={"/about"}
        >
          About
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `rounded-lg p-1 ${isActive ? "bg-primary-dark  text-primary-light p-1  rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`
          }
          to={"/product"}
        >
          Product
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `rounded-lg p-1 ${isActive ? "bg-primary-dark  text-primary-light p-1  rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`
          }
          to={"/cart"}
        >
          Cart
        </NavLink>
        {user && (
          <NavLink
            className={({ isActive }) =>
              `rounded-lg p-1 ${isActive ? "bg-primary-dark  text-primary-light p-1  rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`
            }
            to={"/checkout"}
          >
            Checkout
          </NavLink>
        )}
        {user && (
          <NavLink
            className={({ isActive }) =>
              `rounded-lg p-1 ${isActive ? "bg-primary-dark  text-primary-light p-1 rounded text-center dark:text-amber-50" : "text-header-text hover:bg-hover-background"}`
            }
            to={"/orders"}
          >
            Orders
          </NavLink>
        )}
      </nav>
    </div>
  );
}

export default NavBar;
