import rateLimit from "express-rate-limit";
function createLimiter(windowMs: number, limit: number, message: string) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      error: message,
      code: "rate_limit_exceeds",
    },
    handler: (req, res, next, options) => {
      res.status(429).json({
        error: message,
        code: "rate_limit_exceeds",
        retryAfter: res.getHeader("Retry-After"),
      });
    },
  });
}

export const generalApiLimiter = createLimiter(
  15 * 60 * 1000,
  100,
  "Too many requests.Please try again later",
);

export const registerLimiter = createLimiter(
  60 * 60 * 1000,
  5,
  "Too many registration attempts.Please try again later",
);

export const loginLimiter = createLimiter(
  15 * 60 * 1000,
  5,
  "Too many login attempts.Please try again later",
);

export const guestSessionLimiter = createLimiter(
  60 * 60 * 1000,
  10,
  "Too many guest-session requests.Please try again later",
);

export const cartLimiter = createLimiter(
  60 * 1000,
  60,
  "Too many cart updates.Please try again later",
);

export const orderLimiter = createLimiter(
  10 * 60 * 1000,
  5,
  "Too many order attempts.Please try again later",
);
