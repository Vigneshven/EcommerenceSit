import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../zustandStore/authStore";

function ProductedRoutes() {

  const users = useAuthStore((state) => state.currentUser);

  if (!users) return <Navigate to={"/"} replace />;

  return <Outlet></Outlet>;
}

export default ProductedRoutes;
