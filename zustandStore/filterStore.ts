import { create } from "zustand";
import type { Inputs } from "../components/ProductFilterForm";
import { createJSONStorage, persist } from "zustand/middleware";

type FilterState = Inputs & {
  setFilters: (filters: Inputs) => void;
  resetFilters: () => void;
};

const initialState: Inputs = {
  search: "",
  category: "all",
  company: "all",
  sortBy: "a-z",
  selling_price: 4000,
  free_shipping: false,
};

const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...initialState,

      setFilters: (filters) => set(filters),

      resetFilters: () => set(initialState),
    }),
    {
      name: "filter-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useFilterStore;
