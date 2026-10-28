import type { CookieOptions, Response } from "express";
import { createHash } from "node:crypto";

export const GUEST_SESSION_COOKIE = "guest_session";
export const GUEST_CSRF_COOKIE = "guest_csrf";
export const LEGACY_GUEST_COOKIE = "guest_id";

export const guestCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const guestCsrfCookieOptions: CookieOptions = {
  ...guestCookieOptions,
  httpOnly: false,
};

export function hashGuestToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function clearGuestCookies(res: Response): void {
  res.clearCookie(GUEST_SESSION_COOKIE, guestCookieOptions);
  res.clearCookie(GUEST_CSRF_COOKIE, guestCsrfCookieOptions);
  res.clearCookie(LEGACY_GUEST_COOKIE, guestCookieOptions);
}
