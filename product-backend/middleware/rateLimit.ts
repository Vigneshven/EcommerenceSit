import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    error: "Too many requests. Please try again later.",
    code: "rate_limit_exceeded",
  },

  handler: (req, res) => {
    const retryAfter = res.getHeader("Retry-After");

    res.status(429).json({
      error: "Too many requests. Please try again later.",
      code: "rate_limit_exceeded",
      retryAfter: retryAfter ? Number(retryAfter) : null,
    });
  },
});
