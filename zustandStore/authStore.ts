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
  isGuest: boolean;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  enterGuestMode: () => void;
  loginUser: (payload: LoginUser) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      token: null,
      isGuest: false,
      hasHydrated: false,

      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },

      enterGuestMode: () => {
        set({ currentUser: null, token: null, isGuest: true });
      },

      loginUser: (payload) =>
        set({
          currentUser: payload.user,
          token: payload.token,
          isGuest: false,
        }),

      logout: () =>
        set({
          currentUser: null,
          token: null,
          isGuest: false,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        token: state.token,
        isGuest: state.isGuest,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export default useAuthStore;
