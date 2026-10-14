import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type User = {
  username: string;
  email: string;
  password: string;
};

type CurrentUser = {
  username: string;
  email: string;
};

type AuthState = {
  users: User[];
  currentUser: CurrentUser | null;
  token: string | null;

  registerUser: (user: User) => void;
  loginUser: (payload: { user: CurrentUser; token: string | null }) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      users: [],
      currentUser: null,
      token: null,

      registerUser: (user) =>
        set((state) => ({
          users: [...state.users, user],
        })),

      loginUser: (payload) =>
        set({
          currentUser: payload.user,
          token: payload.token,
        }),

      logout: () =>
        set({
          currentUser: null,
          token: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useAuthStore;
