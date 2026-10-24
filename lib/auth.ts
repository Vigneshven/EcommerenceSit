import { cookies } from "next/headers";

export async function Auth(): Promise<boolean> {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  console.log("token recieve by next", !!token);

  if (!token) {
    console.log("token cookie not found");
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

    console.log("Auth status:", res.status);

    return res.ok;
  } catch (error) {
    console.log("auth request failed", error);
    return false;
  }
}
