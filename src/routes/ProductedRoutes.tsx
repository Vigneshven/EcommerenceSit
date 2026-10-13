import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Navigate, Outlet } from "react-router-dom";

function ProductedRoutes() {
  const users = useSelector((state: RootState) => state.auth.currentUser);

  if (users) return <Navigate to={"/"} replace />;

  return <Outlet></Outlet>;
}

export default ProductedRoutes;
