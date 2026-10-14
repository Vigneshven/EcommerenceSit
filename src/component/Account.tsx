import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../zustandStore/authStore";

function Account() {

  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();


  const userName = useAuthStore((state) => state.currentUser);

  const handleLogOut = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-full bg-primary-dark">
      <div className="w-full max-w-7xl px-6 mx-auto flex justify-end gap-6 py-2 text-primary-light dark:text-amber-50">
        {userName ? (
          <>
            <span className="text-primary-light dark:text-white mt-1 font-bold">
              Hello, {userName.username}
            </span>
            <button
              type="button"
              onClick={handleLogOut}
              className="cursor-pointer border-2 rounded-xl text-primary text-sm p-1"
            >
              LOGOUT
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="cursor-pointer hover:underline">
              Sign in/Guest
            </Link>
            <Link to="/register" className="cursor-pointer hover:underline">
              Create Account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Account;
