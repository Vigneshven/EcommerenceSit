export function formatPrice(price: number) {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function parsePrice(price: string | number | null | undefined): number {
  if (typeof price === "number") {
    return Number.isFinite(price) ? price : 0;
  }

  if (typeof price !== "string" || !price.trim()) {
    return 0;
  }

  const parsed = Number(price.replace(/[^0-9.-]/g, ""));

  return Number.isFinite(parsed) ? parsed : 0;
}

