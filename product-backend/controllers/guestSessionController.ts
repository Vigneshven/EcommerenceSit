import type { Request, Response } from "express";
import {
  GUEST_CSRF_COOKIE,
  GUEST_SESSION_COOKIE,
  clearGuestCookies,
  guestCookieOptions,
  guestCsrfCookieOptions,
  hashGuestToken,
} from "../utils/guestSession";
import { randomBytes, randomUUID } from "node:crypto";
import {
  insertGuestSession,
  revokeGuestSession,
} from "../models/guestSessionModel";

export async function EndGuestSession(req: Request, res: Response) {
  try {
    const token = req.cookies?.[GUEST_SESSION_COOKIE] as string | undefined;
    const csrfCookie = req.cookies?.[GUEST_CSRF_COOKIE];
    const csrfHeader = req.get("X-CSRF-TOKEN");

    if (token) {
      if (
        typeof csrfCookie !== "string" ||
        typeof csrfHeader !== "string" ||
        csrfCookie !== csrfHeader
      ) {
        return res.status(403).json({
          message: "Invalid or missing csrf token",
        });
      }

      const revoked = await revokeGuestSession(
        hashGuestToken(token),
        csrfHeader,
      );

      if (!revoked) {
        return res.status(403).json({
          message: "Invalid or expired guest session",
        });
      }
    }

    clearGuestCookies(res);
    return res.status(204).end();
  } catch {
    return res.status(500).json({
      message: "Failed to end guest session",
    });
  }
}

export async function createGuestSession(res: Response): Promise<void> {
  const guestId = randomUUID();
  const sessionToken = randomBytes(32).toString("base64url");
  const csrfToken = randomBytes(32).toString("base64url");

  await insertGuestSession(guestId, hashGuestToken(sessionToken), csrfToken);

  res.cookie(GUEST_SESSION_COOKIE, sessionToken, guestCookieOptions);
  res.cookie(GUEST_CSRF_COOKIE, csrfToken, guestCsrfCookieOptions);
}
