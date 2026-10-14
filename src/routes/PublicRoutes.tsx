import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../zustandStore/authStore";

function PublicRoutes() {
  const currentUser = useAuthStore((state) => state.currentUser);

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default PublicRoutes;
