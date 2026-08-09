const rateLimit = require('express-rate-limit')
const jwt = require('jsonwebtoken')
const { createRateLimitStore } = require('./mongoRateLimitStore')

// Hybrid rate-limit key: on Vercel serverless all requests can share a handful
// of egress IPs, so IP-only limiting is coarse and one user can trip another's
// bucket. Key by the authenticated user id when a Bearer token is present
// (jwt.decode — no signature check needed just for bucketing), else fall back
// to the client IP.
function rateLimitKey(req) {
  const auth = req.headers && req.headers.authorization
  if (auth && auth.startsWith('Bearer ')) {
    try {
      const payload = jwt.decode(auth.slice(7))
      if (payload && payload.id) return `user:${payload.id}`
    } catch {
      // malformed token — fall through to IP keying
    }
  }
  return req.ip
}

function limiter(options) {
  const { prefix, ...rest } = options
  return rateLimit({
    keyGenerator: rateLimitKey,
    // We intentionally key on req.ip as a fallback for anonymous requests;
    // express-rate-limit's IPv6 warning only checks for the ipKeyGenerator
    // helper — keep it quiet.
    validate: { keyGeneratorIpFallback: false },
    ...rest,
    store: createRateLimitStore({ prefix }),
  })
}

const authLimiter = limiter({
  prefix: 'rl:auth:',
  windowMs: 60 * 1000,
  max: Number(process.env.RATE_LIMIT_AUTH) || 10,
  message: { message: 'Too many attempts. Please wait a minute and try again.', code: 'RATE_LIMITED' },
  standardHeaders: true,
  legacyHeaders: false,
})

const aiLimiter = limiter({
  prefix: 'rl:ai:',
  windowMs: 60 * 1000,
  max: Number(process.env.RATE_LIMIT_AI) || 20,
  message: { message: 'Too many AI requests. Try again later.', code: 'RATE_LIMITED' },
  standardHeaders: true,
  legacyHeaders: false,
})

const generalLimiter = limiter({
  prefix: 'rl:general:',
  windowMs: 60 * 1000,
  max: Number(process.env.RATE_LIMIT_GENERAL) || 100,
  message: { message: 'Too many requests. Try again later.', code: 'RATE_LIMITED' },
  standardHeaders: true,
  legacyHeaders: false,
})

const loginLimiter = limiter({
  prefix: 'rl:login:',
  windowMs: 60 * 1000,
  max: Number(process.env.RATE_LIMIT_LOGIN) || 5,
  message: { message: 'Too many login attempts. Try again in a minute.', code: 'RATE_LIMITED' },
  standardHeaders: true,
  legacyHeaders: false,
})

const refreshLimiter = limiter({
  prefix: 'rl:refresh:',
  windowMs: 60 * 1000,
  max: Number(process.env.RATE_LIMIT_REFRESH) || 30,
  message: { message: 'Too many refresh attempts. Try again in a minute.', code: 'RATE_LIMITED' },
  standardHeaders: true,
  legacyHeaders: false,
})

module.exports = { authLimiter, aiLimiter, generalLimiter, loginLimiter, refreshLimiter }
