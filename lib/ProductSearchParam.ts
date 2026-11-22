export type ProductFilters = {
  search: string;
  category: string;
  company: string;
  sortBy: string;
  minPrice: number;
  maxPrice: number;
  free_shipping: boolean;
};

export type ProductPriceBounds = {
  minPrice: number;
  maxPrice: number;
};

export function getDefaultFilters(bounds: ProductPriceBounds): ProductFilters {
  return {
    search: "",
    category: "all",
    company: "all",
    sortBy: "a-z",
    minPrice: bounds.minPrice,
    maxPrice: bounds.maxPrice,
    free_shipping: false,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function readProductFilters(
  params: URLSearchParams,
  bounds: ProductPriceBounds,
): ProductFilters {
  const defaults = getDefaultFilters(bounds);
  const rawMinPrice = params.get("minPrice");
  const rawMaxPrice = params.get("maxPrice");
  const parsedMin = Number(rawMinPrice);
  const parsedMax = Number(rawMaxPrice);

  let minPrice =
    rawMinPrice !== null && Number.isFinite(parsedMin)
      ? clamp(parsedMin, 0, bounds.maxPrice)
      : 0;
  let maxPrice =
    rawMaxPrice !== null && Number.isFinite(parsedMax)
      ? clamp(parsedMax, 0, bounds.maxPrice)
      : bounds.maxPrice;

  if (minPrice > maxPrice) {
    minPrice = 0;
    maxPrice = bounds.maxPrice;
  }

  return {
    search: params.get("search") ?? defaults.search,
    category: params.get("category") ?? defaults.category,
    company: params.get("company") ?? defaults.company,
    sortBy: params.get("sortBy") ?? defaults.sortBy,
    minPrice,
    maxPrice,
    free_shipping: params.get("freeShipping") === "true",
  };
}

export function writeProductFilters(
  current: URLSearchParams,
  filters: ProductFilters,
  bounds: ProductPriceBounds,
): URLSearchParams {
  const params = new URLSearchParams(current.toString());
  const defaults = getDefaultFilters(bounds);

  let minPrice = clamp(filters.minPrice, 0, bounds.maxPrice);
  let maxPrice = clamp(filters.maxPrice, 0, bounds.maxPrice);

  if (minPrice > maxPrice) {
    minPrice = 0;
    maxPrice = bounds.maxPrice;
  }

  const values: Record<string, string> = {
    search: filters.search.trim(),
    category: filters.category,
    company: filters.company,
    sortBy: filters.sortBy,
    minPrice: String(minPrice),
    maxPrice: String(maxPrice),
    freeShipping: String(filters.free_shipping),
  };

  const defaultsMap: Record<string, string> = {
    search: defaults.search,
    category: defaults.category,
    company: defaults.company,
    sortBy: defaults.sortBy,
    minPrice: String(defaults.minPrice),
    maxPrice: String(defaults.maxPrice),
    freeShipping: String(defaults.free_shipping),
  };

  for (const [key, value] of Object.entries(values)) {
    if (value === defaultsMap[key]) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  return params;
}
