import rateLimit from "express-rate-limit";

export const formSubmissionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.user?.email || req.ip,
  message: "Too many applications submitted, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
