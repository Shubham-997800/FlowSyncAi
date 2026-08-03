import { describe, it, expect } from 'vitest'
import { validateEmail } from './validation'

describe('validateEmail', () => {
  it('returns an error when email is missing', () => {
    expect(validateEmail('')).toBe('Email is required')
    expect(validateEmail(undefined)).toBe('Email is required')
    expect(validateEmail('   ')).toBe('Email is required')
  })

  it('accepts a valid email', () => {
    expect(validateEmail('user@example.com')).toBeNull()
    expect(validateEmail('a.b+c@sub.domain.co')).toBeNull()
  })

  it('rejects an email without an @ sign', () => {
    expect(validateEmail('not-an-email')).toBe('Invalid email format')
  })

  it('rejects an email without a dot in the domain', () => {
    expect(validateEmail('user@localhost')).toBe('Invalid email format')
  })

  it('rejects emails with consecutive dots in the domain', () => {
    expect(validateEmail('user@exa..mple.com')).toBe('Invalid email format')
  })

  it('rejects domains with leading or trailing dots', () => {
    expect(validateEmail('user@.example.com')).toBe('Invalid email format')
    expect(validateEmail('user@example.com.')).toBe('Invalid email format')
  })

  it('rejects emails longer than 254 chars', () => {
    const long = `a${'b'.repeat(300)}@example.com`
    expect(validateEmail(long)).toBe('Email is too long')
  })
})
