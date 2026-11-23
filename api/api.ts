import getGuestCsrfToken from "@/product-backend/utils/guestCsrfToken";
import { cart } from "@/type/Cart";
import LoginUser from "@/type/LoginUser";
import { CreateOrder, Order } from "@/type/Order";
import { Product } from "@/type/Product";
import { RegisterUser, RegisterResponse } from "@/type/RegisterUser";
import useAuthStore from "@/zustandStore/authStore";
import { CheckoutResponse } from "./types/types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

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
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message);
  }

  return result;
}

export async function logoutUser(): Promise<void> {
  const { isGuest, logout } = useAuthStore.getState();

  if (isGuest) {
    const csrfToken = getGuestCsrfToken();

    const res = await fetch(`${baseUrl}/api/guest/sessions`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
      },
    });

    if (!res.ok) {
      throw new Error("failed to end guest session");
    }
  } else {
    const res = await fetch(`${baseUrl}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to logout");
    }
  }
  logout();
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
  const headers: HeadersInit = { "Content-Type": "application/json" };

  const url = isGuest ? `${baseUrl}/api/cart/guest` : `${baseUrl}/api/cart`;

  const res = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Get cart failed:", res.status, errorText);
    throw new Error(`Failed to fetch cart: ${res.status}`);
  }

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

  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (isGuest) {
    url = `${baseUrl}/api/cart/guest`;
    const csrfToken = getGuestCsrfToken();
    if (!csrfToken) throw new Error("Guest csrf missing");
    headers["X-CSRF-TOKEN"] = csrfToken;
  } else if (data.userId !== undefined) {
    url = `${baseUrl}/api/cart`;
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
  const url = isGuest
    ? `${baseUrl}/api/cart/guest/${cartItemId}`
    : `${baseUrl}/api/cart/${cartItemId}`;
  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (isGuest) {
    const csrfToken = getGuestCsrfToken();

    if (!csrfToken) {
      throw new Error("Guest csrf missing");
    }
    headers["X-CSRF-TOKEN"] = csrfToken;
  }

  const res = await fetch(url, {
    method: "PUT",
    headers,
    credentials: "include",
    body: JSON.stringify({
      quantity,
    }),
  });

  if (!res.ok) {
    throw new Error("fail to update cart items");
  }
  return res.json();
}

export async function deleteCartItem(
  cartItemId: number,
  userId?: number,
  isGuest: boolean = false,
) {
  const url = isGuest
    ? `${baseUrl}/api/cart/guest/${cartItemId}`
    : `${baseUrl}/api/cart/${cartItemId}`;
  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (isGuest) {
    const csrfToken = getGuestCsrfToken();

    if (!csrfToken) {
      throw new Error("Guest csrf missing");
    }
    headers["X-CSRF-TOKEN"] = csrfToken;
  }

  const res = await fetch(url, {
    method: "DELETE",
    headers,
    credentials: "include",
  });

  if (!res.ok) throw new Error("fail to delete item");

  return res.json();
}

// orders

export async function createOrder(data: CreateOrder, isGuest = false) {
  const useGuestRoute = isGuest;
  const url = useGuestRoute
    ? `${baseUrl}/api/order/guest`
    : `${baseUrl}/api/order`;

  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (useGuestRoute) {
    const csrfToken = getGuestCsrfToken();
    if (!csrfToken) throw new Error("Guest csrf missing");
    headers["X-CSRF-TOKEN"] = csrfToken;
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

export async function getOrders(
  userId: number | undefined,
  isGuest: boolean,
): Promise<Order[]> {
  const useGuestRoute = isGuest;

  const headers: HeadersInit = {};

  const url = useGuestRoute
    ? `${baseUrl}/api/order/guest`
    : `${baseUrl}/api/order`;

  const res = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "Failed to fetch orders");
  }

  const result = await res.json();

  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  throw new Error("Invalid orders response");
}

export async function createPayoutCheckout(
  name: string,
  address: string,
  isGuest: boolean,
): Promise<CheckoutResponse> {
  const url = isGuest
    ? `${baseUrl}/api/payment/guest/checkout`
    : `${baseUrl}/api/payment/checkout`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (isGuest) {
    const csrfToken = getGuestCsrfToken();
    if (!csrfToken) {
      throw new Error("Guest CSRF token is missing");
    }
    headers["X-CSRF-TOKEN"] = csrfToken;
  }
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify({ name, address }),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error("Unable to create checkout session");
  }

  const checkout = data.data;

  if (!checkout?.clientSecret) {
    throw new Error("Stripe client secret is missing");
  }

  return checkout;
}

export type PendingCheckout = {
  sessionId: string;
  name: string;
  address: string;
  product: {
    id: number;
    name: string;
    amount: number;
    price: number;
    color: string;
  }[];
  cost: number;
  status: string;
  createdAt: string;
};

export async function getPendingCheckouts(
  isGuest: boolean,
): Promise<PendingCheckout[]> {
  const url = isGuest
    ? `${baseUrl}/api/payment/guest/pending`
    : `${baseUrl}/api/payment/pending`;
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch pending checkouts");

  const result = await res.json();
  return Array.isArray(result?.data) ? result.data : [];
}
