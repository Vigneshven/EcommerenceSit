import { create } from "zustand";
import type { Inputs } from "../component/ProductFilterForm";

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

const useFilterStore = create<FilterState>((set) => ({
  ...initialState,

  setFilters: (filters) => set(filters),

  resetFilters: () => set(initialState),
}));

export default useFilterStore;
