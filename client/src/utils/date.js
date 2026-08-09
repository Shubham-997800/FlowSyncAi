// Local-timezone date helpers. Backend deadlines/createdAt are ISO strings that
// parse to UTC; toISOString().split('T')[0] yields the UTC date, which can be a
// different calendar day than the user's local date. These helpers always
// format in local time.

export function formatDateKey(d) {
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return null
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function getTodayKey() {
  return formatDateKey(new Date())
}

// Convert any deadline value (date-only string, ISO string, Date) to a local
// YYYY-MM-DD key. Already date-only strings are returned as-is.
export function toDateKey(value) {
  if (!value) return null
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const d = new Date(value)
  return formatDateKey(d)
}

// Parse a date value as a local Date. Date-only strings are interpreted in the
// local timezone instead of UTC so day/weekday labels never shift by one day.
export function parseLocalDate(value) {
  if (!value) return null
  let d
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, day] = value.split('-').map(Number)
    d = new Date(y, m - 1, day)
  } else {
    d = new Date(value)
  }
  return Number.isNaN(d.getTime()) ? null : d
}

// Local week dates (Sun..Sat) ending today
export function getWeekDateKeys() {
  const keys = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    keys.push(formatDateKey(d))
  }
  return keys
}
