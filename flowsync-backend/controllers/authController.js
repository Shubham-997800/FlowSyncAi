const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User')
const Session = require('../models/Session')
const { handleError } = require('../utils/errorHandler')
const { sanitizeText } = require('../utils/sanitize')
const { parseUserAgent } = require('../utils/ua')

const ACCESS_TOKEN_TTL = '7d'
const REFRESH_TOKEN_TTL = '30d'
const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000
// Sessions whose token could not possibly still be alive (refresh TTL 30d).
const SESSION_STALE_MS = 35 * 24 * 60 * 60 * 1000

const generateAccessToken = (id, tokenVersion, jti) =>
  jwt.sign({ id, tokenVersion, jti }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL })

const generateRefreshToken = (id, tokenVersion, refreshVersion, jti) =>
  jwt.sign({ id, tokenVersion, refreshVersion, type: 'refresh', jti }, process.env.JWT_SECRET, { expiresIn: REFRESH_TOKEN_TTL })

const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: REFRESH_COOKIE_MAX_AGE,
})

const setRefreshCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, refreshCookieOptions())
}

const clearRefreshCookie = (res) => {
  res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' })
}

function sessionLabel(req) {
  const { device, browser, os } = parseUserAgent(req.headers['user-agent'] || '')
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || ''
  return { device, browser, os, ip: ip.slice(0, 64) }
}

async function upsertSession(userId, jti, req) {
  const label = sessionLabel(req)
  await Session.findOneAndUpdate(
    { user: userId, jti },
    { $set: { ...label, lastActive: new Date() } },
    { upsert: true }
  )
}

// Issues a fresh token pair bound to a new per-device session id.
async function issueTokens(user, req, res, { rotateRefreshVersion = false } = {}) {
  if (rotateRefreshVersion) {
    user.refreshVersion = (user.refreshVersion || 0) + 1
    await user.save()
  }
  const jti = crypto.randomUUID()
  const accessToken = generateAccessToken(user._id, user.tokenVersion, jti)
  const refreshToken = generateRefreshToken(user._id, user.tokenVersion, user.refreshVersion, jti)
  await upsertSession(user._id, jti, req)
  setRefreshCookie(res, refreshToken)
  return { token: accessToken, refreshToken, user }
}

const isNonEmptyString = (v) => typeof v === 'string' && v.trim() !== ''

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists. Try signing in.' })
    }
    const newUser = await User.create({ name: sanitizeText(name), email, password })
    const payload = await issueTokens(newUser, req, res)
    res.status(201).json({ message: 'Account created successfully.', ...payload })
  } catch (error) {
    console.error('Signup error:', error.message, error.name)
    if (error.name === 'ValidationError') {
      const msgs = Object.values(error.errors).map(e => e.message).join(', ')
      return res.status(400).json({ message: msgs })
    }
    if (error.code === 11000) return res.status(400).json({ message: 'Duplicate field' })
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid ID' })
    handleError(res, error)
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    if (user.isLocked) {
      return res.status(423).json({ message: 'Account locked. Try again in 15 minutes.' })
    }
    if (!(await user.comparePassword(password))) {
      await user.incrementLoginAttempts()
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    await user.resetLoginAttempts()
    const payload = await issueTokens(user, req, res)
    res.json(payload)
  } catch (error) {
    handleError(res, error)
  }
}

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken
    if (!isNonEmptyString(refreshToken)) {
      return res.status(401).json({ message: 'Refresh token required' })
    }
    let decoded
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)
    } catch {
      return res.status(401).json({ message: 'Refresh token invalid or expired' })
    }
    if (decoded.type !== 'refresh' || !decoded.id) {
      return res.status(401).json({ message: 'Refresh token invalid or expired' })
    }
    const user = await User.findById(decoded.id)
    if (!user) return res.status(401).json({ message: 'User not found' })
    if (user.tokenVersion !== decoded.tokenVersion) {
      clearRefreshCookie(res)
      return res.status(401).json({ message: 'Session revoked. Please sign in again.' })
    }
    if (user.refreshVersion !== decoded.refreshVersion) {
      // Reuse of an already-rotated refresh token: nuke every session.
      user.tokenVersion = (user.tokenVersion || 0) + 1
      user.refreshVersion = (user.refreshVersion || 0) + 1
      await user.save()
      await Session.deleteMany({ user: user._id })
      clearRefreshCookie(res)
      return res.status(401).json({ message: 'Refresh token reuse detected. Please sign in again.' })
    }
    if (decoded.jti) {
      // A revoked/removed device session cannot mint new tokens.
      const alive = await Session.exists({ user: user._id, jti: decoded.jti })
      if (!alive) {
        clearRefreshCookie(res)
        return res.status(401).json({ message: 'Session revoked. Please sign in again.' })
      }
    }
    // Rotate: retire the old session row (if any) and bind a fresh one.
    if (decoded.jti) await Session.deleteOne({ user: user._id, jti: decoded.jti })
    const payload = await issueTokens(user, req, res, { rotateRefreshVersion: true })
    res.json(payload)
  } catch (error) {
    handleError(res, error)
  }
}

const logout = async (req, res) => {
  try {
    // Per-device logout: revoke only this device's session so other
    // devices stay signed in. Tokens issued before sessions existed are
    // force-revoked via the tokenVersion bump (legacy path).
    if (req.authJti) {
      await Session.deleteOne({ user: req.user._id, jti: req.authJti })
    } else {
      req.user.tokenVersion = (req.user.tokenVersion || 0) + 1
      await req.user.save()
    }
    clearRefreshCookie(res)
    res.json({ message: 'Logged out' })
  } catch (error) {
    handleError(res, error)
  }
}

// GET /api/auth/sessions — list active devices for the signed-in user.
const getSessions = async (req, res) => {
  try {
    const cutoff = new Date(Date.now() - SESSION_STALE_MS)
    await Session.deleteMany({ user: req.user._id, lastActive: { $lt: cutoff } })
    const sessions = await Session.find({ user: req.user._id }).sort({ lastActive: -1 }).lean()
    res.json(sessions.map(s => ({
      _id: s._id,
      device: s.device,
      browser: s.browser,
      os: s.os,
      ip: s.ip,
      createdAt: s.createdAt,
      lastActive: s.lastActive,
      current: !!req.authJti && s.jti === req.authJti,
    })))
  } catch (error) {
    handleError(res, error)
  }
}

// DELETE /api/auth/sessions/:id — revoke one device.
const revokeSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!session) return res.status(404).json({ message: 'Session not found' })
    res.json({ message: 'Device signed out', current: !!req.authJti && session.jti === req.authJti })
  } catch (error) {
    handleError(res, error)
  }
}

// POST /api/auth/sessions/logout-others — revoke every other device.
const logoutOthers = async (req, res) => {
  try {
    const filter = req.authJti
      ? { user: req.user._id, jti: { $ne: req.authJti } }
      : { user: req.user._id }
    const result = await Session.deleteMany(filter)
    res.json({ message: 'All other devices signed out', revoked: result.deletedCount })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { signup, login, refresh, logout, getSessions, revokeSession, logoutOthers }
