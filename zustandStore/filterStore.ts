import { Inputs } from "@/components/ProductFilterForm";
import { create } from "zustand";
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
  free_shipping: false,
  minPrice: 0,
  maxPrice: 0,
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
