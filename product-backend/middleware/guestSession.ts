import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";

export function guestSession(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  const authCookie = req.cookies?.token;

  if (authorization || authCookie) {
    return res.status(403).json({
      message: "Guest access is not allowed with user credentials",
    });
  }

  let guestId = req.cookies?.guest_id as string | undefined;

  const validUuid =
    typeof guestId === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      guestId,
    );

  if (!validUuid) {
    guestId = randomUUID();
  }
  res.cookie("guest_id", guestId, {
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  req.guestId = guestId;

  return next();
}
