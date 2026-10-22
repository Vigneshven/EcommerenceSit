import { cart } from "@/type/Cart";
import LoginUser from "@/type/LoginUser";
import { CreateOrder } from "@/type/Order";
import { Product } from "@/type/Product";
import { RegisterUser, RegisterResponse } from "@/type/RegisterUser";

const baseUrl = process.env.NEXT_BASE_URL ?? "http://localhost:4000";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${baseUrl}/api/products`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export async function getProductById(id: string): Promise<Product | null> {
  const res = await fetch(`${baseUrl}/api/products/${id}`, {
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;

  if (!res.ok) throw new Error("Failed to show product");

  return res.json();
}

export async function loginUsers(data: LoginUser) {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message);
  }

  return result;
}

export async function registerUser(
  data: RegisterUser,
): Promise<RegisterResponse> {
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message);
  }

  return result;
}

export async function getCart(
  userId?: number | undefined,
  isGuest?: boolean,
): Promise<cart[]> {
  // const params = userId ? `?userId=${userId}` : isGuest ? "?guest=true" : "";

  let url: string;

  if (userId !== undefined) {
    url = `${baseUrl}/api/cart?userId=${userId}`;
  } else if (isGuest) {
    url = `${baseUrl}/api/cart?guest=true`;
  } else {
    throw new Error("Cannot fetch without valid owner");
  }

  const res = await fetch(url);

  if (!res.ok) throw new Error("fail to fetch");

  return res.json();
}

export async function addToCart(
  data: {
    userId?: number;
    productId: number;
    quantity?: number;
    color?: string;
  },
  isGuest: boolean = false,
) {
  const params = isGuest && !data.userId ? "?guest=true" : "";
  const res = await fetch(`${baseUrl}/api/cart${params}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const responseText = await res.text();

  if (!res.ok) {
    throw new Error(responseText || "Failed to add cart item");
  }

  return responseText ? JSON.parse(responseText) : null;
}

export async function updateCartItem(
  cartItemId: number,
  quantity: number,
  userId?: number,
  isGuest: boolean = false,
) {
  const params = userId ? "" : isGuest ? "?guest=true" : "";
  const res = await fetch(`${baseUrl}/api/cart/${cartItemId}${params}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quantity,
      ...(userId !== undefined && userId > 0 ? { userId } : {}),
    }),
  });

  if (!res.ok) throw new Error("fail to update cart items");

  return res.json();
}

export async function deleteCartItem(
  cartItemId: number,
  userId?: number,
  isGuest: boolean = false,
) {
  const params = userId ? `?userId=${userId}` : isGuest ? "?guest=true" : "";

  const res = await fetch(`${baseUrl}/api/cart/${cartItemId}${params}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("fail to delete item");

  return res.json();
}

// orders

export async function createOrder(data: CreateOrder) {
  const res = await fetch(`${baseUrl}/api/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("failed to placeOrder");

  return res.json();
}

export async function getOrders(userId: number | null, isGuest: boolean) {
  const params = new URLSearchParams();

  if (userId !== null) {
    params.set("userId", String(userId));
  } else if (isGuest) {
    params.set("guest", "true");
  } else {
    throw new Error("Please log in or enter guest mode.");
  }

  const res = await fetch(`${baseUrl}/api/order?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
}
