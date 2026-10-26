import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  const isGuest = req.query.guest === "true";

  if (isGuest) return next();

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "authorizztion token require",
    });
  }

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : req.cookies?.token;

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      message: "authentication config error",
    });
  }
  try {
    const decode = jwt.verify(token, secret);
    if (
      typeof decode === "string" ||
      !Number.isInteger(decode.userId) ||
      decode.userId <= 0
    ) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }


    req.userId = decode.userId;
    next();
  } catch {
    return res.status(401).json({
      message: "invalid or expire token",
    });
  }
}
