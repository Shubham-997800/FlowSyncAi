export function validateEmail(email) {
  if (!email || !email.trim()) return 'Email is required'
  const normalized = email.trim().toLowerCase()
  if (normalized.length > 254) return 'Email is too long'
  const atIndex = normalized.lastIndexOf('@')
  if (atIndex < 1) return 'Invalid email format'
  const local = normalized.slice(0, atIndex)
  const domain = normalized.slice(atIndex + 1)
  if (!local || local.length > 64) return 'Invalid email format'
  if (!domain || domain.length > 255) return 'Invalid email format'
  if (domain.startsWith('.') || domain.endsWith('.')) return 'Invalid email format'
  if (!/\./.test(domain)) return 'Invalid email format'
  if (/\.\./.test(domain)) return 'Invalid email format'
  return null
}
