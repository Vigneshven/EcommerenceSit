import type { Request, Response, NextFunction } from "express";
import pool from "../config/db";
import { CsrfRow } from "../type/GuestSession";
import { GUEST_CSRF_COOKIE } from "../utils/guestSession";

export async function guestCsrf(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.userId) {
    return next();
  }

  if (["GET", "HEAD"].includes(req.method)) {
    return next();
  }

  const guestId = req.guestId;
  const cookieToken = req.cookies?.[GUEST_CSRF_COOKIE];
  const headerToken = req.get("X-CSRF-TOKEN");

  if (
    !guestId ||
    typeof cookieToken !== "string" ||
    typeof headerToken !== "string" ||
    cookieToken !== headerToken
  ) {
    return res.status(403).json({
      message: "invalid or missing csrf token",
    });
  }

  const [rows] = await pool.execute<CsrfRow[]>(
    `select csrf_token
    from guest_sessions
    where guest_id=?
    and revoked_at is null
    and expires_at > utc_timestamp()
    limit 1`,
    [guestId],
  );

  if (!rows[0] || rows[0].csrf_token !== headerToken) {
    return res.status(403).json({
      message: "failed to validate csrf token",
    });
  }
  return next();
}
