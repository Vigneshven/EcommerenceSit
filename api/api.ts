import { cart } from "@/type/Cart";
import LoginUser from "@/type/LoginUser";
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
  const params = userId ? `?userId=${userId}` : isGuest ? "?guest=true" : "";

  const res = await fetch(`${baseUrl}/api/cart${params}`);

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
