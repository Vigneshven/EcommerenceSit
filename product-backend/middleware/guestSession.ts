import type { Request, Response, NextFunction, CookieOptions } from "express";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import pool from "../config/db";
import { GuestSessionRow } from "../type/GuestSession";
import { ResultSetHeader } from "mysql2";

const cookie_Name = "guest_session";
const csrf_cookie_name = "guest_csrf"; //additional security along with token
// (cross site  request forgery)
const session_days = 7;

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: session_days * 24 * 60 * 60 * 1000,
};

function hasToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function newSecret(): string {
  return randomBytes(32).toString("base64url");
}

export async function guestSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // const authorization = req.headers.authorization;
  // const authCookie = req.cookies?.token;

  // if (authorization || authCookie) {
  //   return res.status(403).json({
  //     message: "Guest access is not allowed with user credentials",
  //   });
  // }

  // let guestId = req.cookies?.guest_id as string | undefined;

  // const validUuid =
  //   typeof guestId === "string" &&
  //   /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
  //     guestId,
  //   );

  // if (!validUuid) {
  //   guestId = randomUUID();
  // }
  // res.cookie("guest_id", guestId, {
  //   httpOnly: true,
  //   path: "/",
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  // });

  // req.guestId = guestId;

  // return next();
  try {
    if (req.userId) {
      return next();
    }

    if (req.headers.authorization || req.cookies?.token) {
      return res.status(401).json({
        message: "Invalid or unverified user credentials",
      });
    }

    const presentToken = req.cookies?.[cookie_Name] as string | undefined;

    if (presentToken) {
      const [rows] = await pool.execute<GuestSessionRow[]>(
        `select guest_id,csrf_token,expires_at,revoked_at
        from guest_sessions
        where token_hash=?
        and revoked_at is null
        and expires_at > utc_timestamp()
        limit 1`,
        [hasToken(presentToken)],
      );

      const session = rows[0];

      if (session) {
        req.guestId = session.guest_id;

        await pool.execute(
          `update guest_sessions set last_seen_at=utc_timestamp() where guest_id=?`,
          [session.guest_id],
        );
        res.cookie(csrf_cookie_name, session.csrf_token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: cookieOptions.maxAge,
        });

        return next();
      }
      res.clearCookie(cookie_Name, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      res.clearCookie(csrf_cookie_name, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    const guestId = randomUUID();
    const sessionToken = newSecret();
    const csrfToken = newSecret();

    await pool.execute<ResultSetHeader>(
      `insert into guest_sessions (guest_id,token_hash,csrf_token,expires_at) 
      values(?,?,?,date_add(utc_timestamp(),interval 7 day))`,
      [guestId, hasToken(sessionToken), csrfToken],
    );

    res.cookie(cookie_Name, sessionToken, cookieOptions);

    res.cookie(csrf_cookie_name, csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV == "production",
      sameSite: "lax",
      path: "/",
      maxAge: cookieOptions.maxAge,
    });

    req.guestId = guestId;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to validate guest session",
    });
  }
}
