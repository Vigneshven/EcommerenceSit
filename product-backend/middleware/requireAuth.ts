import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  const BearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;

  const cookieToken = req.cookies?.token as string | undefined;

  const token = BearerToken || cookieToken;

  if (!token) {
    return res.status(401).json({
      message: "authorizztion token require",
    });
  }
  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        message: "authentication config error",
      });
    }
    const decode = jwt.verify(token, secret);
    if (
      typeof decode !== "object" ||
      decode === null ||
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
