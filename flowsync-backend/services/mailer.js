// Pluggable email delivery. Ships a no-op when no provider key is configured so
// the app never depends on a mail provider to function.
// Transient failures (network errors, 408/429/5xx) are retried with exponential
// backoff; hard failures (4xx like 401/422) fail fast so we never burn retries
// on permanent rejections.

const MAX_ATTEMPTS = 3
const BACKOFF_MS = 500
const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504])

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function sendEmail({ to, subject, html, text }) {
  if (!process.env.RESEND_API_KEY) return { skipped: true, reason: 'RESEND_API_KEY not set' }
  if (!process.env.EMAIL_FROM) return { skipped: true, reason: 'EMAIL_FROM not set' }
  if (!to || !subject) return { skipped: true, reason: 'missing to/subject' }

  let lastErr = null
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let retryable
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject, html, text }),
      })

      if (res.ok) return { ok: true, attempts: attempt }

      const body = await res.text().catch(() => '')
      const err = new Error(`Email send failed (${res.status})`)
      err.details = body.slice(0, 300)
      err.status = res.status
      retryable = RETRYABLE_STATUS.has(res.status)
      lastErr = err
    } catch (err) {
      // Network-level failures (fetch throws) are transient by nature.
      lastErr = err
      retryable = true
    }

    if (!retryable) throw lastErr
    if (attempt < MAX_ATTEMPTS) await sleep(BACKOFF_MS * 2 ** (attempt - 1))
  }
  throw lastErr
}

module.exports = { sendEmail }
