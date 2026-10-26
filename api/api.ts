import { cart } from "@/type/Cart";
import LoginUser from "@/type/LoginUser";
import { CreateOrder } from "@/type/Order";
import { Product } from "@/type/Product";
import { RegisterUser, RegisterResponse } from "@/type/RegisterUser";
import useAuthStore from "@/zustandStore/authStore";

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

export async function loginUsers(
  data: LoginUser & { forceNewSession?: boolean },
) {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      ...data,
      forceNewSession: data.forceNewSession ?? false,
    }),
  });
  const result = await res.json();

  if (res.status === 409) {
    return { sessionExists: true };
  }
  if (!res.ok) {
    throw new Error(result.message);
  }

  return { ...result, sessionExists: false };
}

export async function logoutUser(): Promise<void> {
  const res = await fetch(`${baseUrl}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Logout successfully");
  }
}

export async function guestLogin(): Promise<void> {
  const res = await fetch(`${baseUrl}/api/auth/guest`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to Enter Guest Mode");
  }
}

export async function registerUser(
  data: RegisterUser,
): Promise<RegisterResponse> {
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
  let url: string;
  const token = useAuthStore.getState().token;

  const headers: HeadersInit = {};

  headers.Authorization = `Bearer ${token}`;

  if (userId !== undefined) {
    url = `${baseUrl}/api/cart?userId=${userId}`;
  } else if (isGuest) {
    url = `${baseUrl}/api/cart?guest=true`;
  } else {
    throw new Error("Cannot fetch without valid owner");
  }

  const res = await fetch(url, { headers, credentials: "include" });

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
  let url: string;

  const token = useAuthStore.getState().token;

  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (isGuest) {
    url = `${baseUrl}/api/cart?guest=true`;
  } else if (data.userId !== undefined) {
    url = `${baseUrl}/api/cart?userId=${data.userId}`;

    if (data.userId !== undefined && token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } else {
    throw new Error("cannot add items to cart without valid owner");
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to add cart item");
  }

  return res.json();
}

export async function updateCartItem(
  cartItemId: number,
  quantity: number,
  userId?: number,
  isGuest: boolean = false,
) {
  const params = userId ? "" : isGuest ? "?guest=true" : "";
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const token = useAuthStore.getState().token;

  if (userId !== undefined && token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${baseUrl}/api/cart/${cartItemId}${params}`, {
    method: "PUT",
    headers,
    credentials: "include",
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
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const token = useAuthStore.getState().token;

  if (userId !== undefined && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${baseUrl}/api/cart/${cartItemId}${params}`, {
    method: "DELETE",
    headers,
    credentials: "include",
  });

  if (!res.ok) throw new Error("fail to delete item");

  return res.json();
}

// orders

export async function createOrder(data: CreateOrder, isGuest = false) {
  const url = isGuest
    ? `${baseUrl}/api/order?guest=true`
    : `${baseUrl}/api/order`;

  const token = useAuthStore.getState().token;

  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (!isGuest && token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
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

  const token = useAuthStore.getState().token;

  const res = await fetch(`${baseUrl}/api/order?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
}
