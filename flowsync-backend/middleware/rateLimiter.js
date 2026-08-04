const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.RATE_LIMIT_AUTH) || 10,
  message: { message: 'Too many attempts. Please wait a minute and try again.', code: 'RATE_LIMITED' },
  standardHeaders: true,
  legacyHeaders: false,
})

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.RATE_LIMIT_AI) || 20,
  message: { message: 'Too many AI requests. Try again later.', code: 'RATE_LIMITED' },
  standardHeaders: true,
  legacyHeaders: false,
})

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.RATE_LIMIT_GENERAL) || 100,
  message: { message: 'Too many requests. Try again later.', code: 'RATE_LIMITED' },
  standardHeaders: true,
  legacyHeaders: false,
})

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.RATE_LIMIT_LOGIN) || 5,
  message: { message: 'Too many login attempts. Try again in a minute.', code: 'RATE_LIMITED' },
  standardHeaders: true,
  legacyHeaders: false,
})

const refreshLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.RATE_LIMIT_REFRESH) || 30,
  message: { message: 'Too many refresh attempts. Try again in a minute.', code: 'RATE_LIMITED' },
  standardHeaders: true,
  legacyHeaders: false,
})

module.exports = { authLimiter, aiLimiter, generalLimiter, loginLimiter, refreshLimiter }
