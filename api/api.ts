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
  const res = await fetch(`${baseUrl}/api/product/${id}`, {
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
