import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
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

  const session = await prisma.guest_sessions.findFirst({
    where: {
      guest_id: guestId,
      revoked_at: null,
      expires_at: { gt: new Date() },
    },
    select: { csrf_token: true },
  });

  if (!session || session.csrf_token !== headerToken) {
    return res.status(403).json({
      message: "failed to validate csrf token",
    });
  }
  return next();
}
