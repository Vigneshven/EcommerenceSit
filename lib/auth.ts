import { cookies } from "next/headers";

export async function Auth() {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) return false;

  try {
    const res = await fetch(`${process.env.NEXT_BASE_URL}/api/auth/me`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    return res.ok;
  } catch {
    return false;
  }
}
