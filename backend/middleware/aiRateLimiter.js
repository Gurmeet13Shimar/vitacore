const rateLimit = require('express-rate-limit');

/**
 * AI-specific rate limiter — 20 requests per 15 minutes per authenticated user.
 * Must be applied AFTER the `protect` middleware so req.user is available.
 * Keys by userId so limits are per-account, not per IP.
 */
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // max 20 AI requests per window
  standardHeaders: true,     // return rate limit info in RateLimit-* headers
  legacyHeaders: false,

  // Key by authenticated user ID (set by protect middleware)
  keyGenerator: (req) => req.user?.id || req.ip,

  // Consistent error response shape
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many AI requests. Please try again later.',
    });
  },

  // Skip rate-limiting if no user (protect middleware handles that 401 separately)
  skip: (req) => !req.user,
});

module.exports = { aiRateLimiter };
