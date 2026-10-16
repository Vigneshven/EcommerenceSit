"use client";

import useAuthStore from "@/zustandStore/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Account() {
  const logOut = useAuthStore((state) => state.logout);
  const currentUser = useAuthStore((state) => state.currentUser);
  const route = useRouter();

  console.log("Current user:", currentUser);
  console.log("Username:", currentUser?.username);

  const handleLogOut = () => {
    logOut();
    route.replace("/");
  };

  return (
    <div className="w-full bg-primary-dark">
      <div className="w-full max-w-7xl px-6 mx-auto flex justify-end gap-6 py-2 text-primary-light dark:text-amber-50">
        {currentUser ? (
          <>
            <span className="text-primary-light dark:text-white mt-1 font-bold">
              Hello, {currentUser.username}
            </span>
            <button
              type="button"
              className="cursor-pointer border font-bold border-border text-primary rounded-xl p-1"
              onClick={handleLogOut}
            >
              LOGOUT
            </button>
          </>
        ) : (
          <>
            <Link href={"/login"}>Sign in/Guest</Link>
            <Link href={"/register"}>Create Account</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Account;
