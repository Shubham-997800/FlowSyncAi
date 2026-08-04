function sanitizeText(value) {
  if (typeof value !== 'string') return value
  return value
    .replace(/<\s*\/?\s*(script|iframe|object|embed|form)\b[^>]*>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .trim()
}

module.exports = { sanitizeText }
