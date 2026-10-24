import { cookies } from "next/headers";

export async function Auth(): Promise<boolean> {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    return false;
  }
  try {
    const res = await fetch(`${process.env.NEXT_BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    return res.ok;
  } catch{
    return false;
  }
}
