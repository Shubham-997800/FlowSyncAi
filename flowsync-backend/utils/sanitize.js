function sanitizeText(value) {
  if (typeof value !== 'string') return value
  return value
    .replace(/<\s*\/?\s*(script|iframe|object|embed|form)\b[^>]*>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .trim()
}

// Build a whitelisted object from a request body. Keys listed in textFields are
// passed through sanitizeText; all other whitelisted values are kept as-is.
function sanitizeBody(body, allowedFields, textFields = []) {
  const safe = {}
  for (const key of allowedFields) {
    if (body[key] === undefined) continue
    safe[key] = textFields.includes(key) ? sanitizeText(body[key]) : body[key]
  }
  return safe
}

module.exports = { sanitizeText, sanitizeBody }
