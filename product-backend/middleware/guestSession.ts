import type { Request, Response, NextFunction } from "express";
import {
  GUEST_CSRF_COOKIE,
  GUEST_SESSION_COOKIE,
  guestCookieOptions,
  guestCsrfCookieOptions,
  hashGuestToken,
} from "../utils/guestSession";
import {
  findValidGuestSession,
  updateGuestSession,
} from "../models/guestSessionModel";

export async function guestSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.headers.authorization || req.cookies?.token) {
      return res.status(401).json({
        message: "Invalid or unverified user credentials",
      });
    }

    const presentToken = req.cookies?.[GUEST_SESSION_COOKIE] as
      | string
      | undefined;

    if (!presentToken) {
      return res.status(401).json({
        message: "Guest session required",
      });
    }

    const tokenHash = hashGuestToken(presentToken);
    const session = await findValidGuestSession(tokenHash);

    if (!session) {
      res.clearCookie(GUEST_SESSION_COOKIE, guestCookieOptions);
      res.clearCookie(GUEST_CSRF_COOKIE, guestCsrfCookieOptions);
      return res.status(401).json({
        message: "Guest session is invalid or expired",
      });
    }

    req.guestId = session.guest_id;

    await updateGuestSession(session.guest_id, tokenHash);

    res.cookie(GUEST_CSRF_COOKIE, session.csrf_token, guestCsrfCookieOptions);
    return next();
  } catch (error) {
    console.error("Guest session validation failed:", error);
    return res.status(500).json({
      message: "Failed to validate guest session",
    });
  }
}
