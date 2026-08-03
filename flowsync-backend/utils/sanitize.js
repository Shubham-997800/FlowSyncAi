function sanitizeText(value) {
  if (typeof value !== 'string') return value
  return value
    .replace(/<\s*\/?\s*(script|iframe|object|embed|form)\b[^>]*>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .trim()
}

function sanitizeObject(obj, fields) {
  const safe = {}
  for (const key of Object.keys(obj)) {
    safe[key] = fields.includes(key) ? sanitizeText(obj[key]) : obj[key]
  }
  return safe
}

module.exports = { sanitizeText, sanitizeObject }
