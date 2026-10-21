import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CurrentUser = {
  id: number;
  username: string;
  email: string;
};

type LoginUser = {
  user: CurrentUser;
  token: string | null;
};

type AuthState = {
  currentUser: CurrentUser | null;
  token: string | null;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;

  loginUser: (payload: LoginUser) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      token: null,
      hasHydrated: false,

      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },

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
      partialize: (state) => ({
        currentUser: state.currentUser,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export default useAuthStore;
