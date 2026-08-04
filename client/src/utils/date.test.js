import { describe, it, expect, vi, afterEach } from 'vitest'
import { formatDateKey, getTodayKey, toDateKey, getWeekDateKeys } from './date'

describe('date utils', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('formatDateKey returns local YYYY-MM-DD', () => {
    const d = new Date(2026, 6, 4)
    expect(formatDateKey(d)).toBe('2026-07-04')
  })

  it('formatDateKey returns null for invalid dates', () => {
    expect(formatDateKey(new Date('invalid'))).toBeNull()
    expect(formatDateKey(null)).toBeNull()
  })

  it('getTodayKey matches local today', () => {
    const now = new Date()
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    expect(getTodayKey()).toBe(expected)
  })

  it('toDateKey keeps date-only strings as-is', () => {
    expect(toDateKey('2026-07-04')).toBe('2026-07-04')
  })

  it('toDateKey converts ISO/deadline strings to local key', () => {
    const local = new Date(2026, 6, 4, 10, 0, 0)
    expect(toDateKey(local.toISOString())).toBe('2026-07-04')
  })

  it('toDateKey returns null for invalid/null input', () => {
    expect(toDateKey(null)).toBeNull()
    expect(toDateKey('garbage')).toBeNull()
  })

  it('getWeekDateKeys returns 7 keys ending today (local)', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 8))
    const keys = getWeekDateKeys()
    expect(keys.length).toBe(7)
    expect(keys[keys.length - 1]).toBe('2026-07-08')
    expect(new Set(keys).size).toBe(7)
  })
})
