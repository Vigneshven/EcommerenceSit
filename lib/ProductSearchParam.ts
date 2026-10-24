export type ProductFilters = {
  search: string;
  category: string;
  company: string;
  sortBy: string;
  selling_price: number;
  free_shipping: boolean;
};

export const defaultFilters: ProductFilters = {
  search: "",
  category: "all",
  company: "all",
  sortBy: "a-z",
  selling_price: 4000,
  free_shipping: false,
};

export function readProductFilters(params: URLSearchParams): ProductFilters {
  const rawPrice = params.get("maxPrice");
  const price = Number(rawPrice);

  return {
    search: params.get("search") ?? "",
    category: params.get("category") ?? "all",
    company: params.get("company") ?? "all",
    sortBy: params.get("sortBy") ?? "a-z",
    selling_price:
      rawPrice !== null && Number.isFinite(price)
        ? Math.max(0, price)
        : defaultFilters.selling_price,
    free_shipping: params.get("freeShipping") === "true",
  };
}

export function writeProductFilters(
  current: URLSearchParams,
  filters: ProductFilters,
): URLSearchParams {
  const params = new URLSearchParams(current.toString());

  const values: Record<string, string> = {
    search: filters.search.trim(),
    category: filters.category,
    company: filters.company,
    sortBy: filters.sortBy,
    maxPrice: String(filters.selling_price),
    freeShipping: String(filters.free_shipping),
  };

  const defaults: Record<string, string> = {
    search: "",
    category: "all",
    company: "all",
    sortBy: "a-z",
    maxPrice: "4000",
    freeShipping: "false",
  };

  for (const [key, value] of Object.entries(values)) {
    if (value === defaults[key]) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  return params;
}
