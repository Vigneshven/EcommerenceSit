import type { CookieOptions, Request, Response } from "express";
import { createHash } from "node:crypto";
import pool from "../config/db";

export async function EndGuestSession(req: Request, res: Response) {
  try {
    const token = req.cookies?.guest_session;

    if (typeof token === "string" && req.guestId) {
      const tokenHash = createHash("sha256").update(token).digest("hex");

      await pool.execute(
        `update guest_sessions
        set revoked_at = utc_timestamp()
        where guest_id=? and token_hash=? and revoked_at is null`,
        [req.guestId, tokenHash],
      );
    }

    const guestCookieOptions: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    res.clearCookie("guest_session", guestCookieOptions);
    res.clearCookie("guest_csrf", {
      ...guestCookieOptions,
      httpOnly: false,
    });
    res.clearCookie("guest_id", guestCookieOptions);

    res.status(204).end();
  } catch {
    return res.status(500).json({
      message: "failed to end guest session",
    });
  }
}
