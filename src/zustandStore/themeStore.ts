import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ThemeState = {
  mode: "light" | "dark";

  toggleTheme: () => void;
};

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "light",

      toggleTheme: () =>
        set((state) => ({
          mode: state.mode === "light" ? "dark" : "light",
        })),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useThemeStore;
