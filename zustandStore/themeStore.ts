import { create } from "zustand";

type ThemeState = {
  mode: "light" | "dark";
  toggleTheme: () => void;
};

const useThemeStore = create<ThemeState>()((set) => ({
  mode: "light",

  toggleTheme: () =>
    set((state) => ({
      mode: state.mode === "light" ? "dark" : "light",
    })),
}));

export default useThemeStore;
