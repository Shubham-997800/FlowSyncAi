// Pluggable email delivery. Ships a no-op when no provider key is configured so
// the app never depends on a mail provider to function.
async function sendEmail({ to, subject, html, text }) {
  if (!process.env.RESEND_API_KEY) return { skipped: true, reason: 'RESEND_API_KEY not set' }
  if (!process.env.EMAIL_FROM) return { skipped: true, reason: 'EMAIL_FROM not set' }
  if (!to || !subject) return { skipped: true, reason: 'missing to/subject' }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject, html, text }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    const err = new Error(`Email send failed (${res.status})`)
    err.details = body.slice(0, 300)
    throw err
  }
  return { ok: true }
}

module.exports = { sendEmail }
