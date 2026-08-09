// Optional Sentry integration — no-op when SENTRY_DSN is not configured so the
// app never depends on an error-tracking account to boot.
let sentry = null

function initSentry() {
  if (!process.env.SENTRY_DSN) return null
  try {
    sentry = require('@sentry/node')
    sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0,
    })
    return sentry
  } catch (err) {
    console.error('Sentry init failed:', err.message)
    sentry = null
    return null
  }
}

function captureException(error, context) {
  if (!sentry) return
  try {
    sentry.captureException(error, context ? { extra: context } : undefined)
  } catch {
    // never let observability break the request
  }
}

module.exports = { initSentry, captureException }
