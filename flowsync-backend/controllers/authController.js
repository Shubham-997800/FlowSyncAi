const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { handleError } = require('../utils/errorHandler')
const { sanitizeText } = require('../utils/sanitize')

const ACCESS_TOKEN_TTL = '7d'
const REFRESH_TOKEN_TTL = '30d'

const generateAccessToken = (id, tokenVersion) =>
  jwt.sign({ id, tokenVersion }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL })

const generateRefreshToken = (id, tokenVersion, refreshVersion) =>
  jwt.sign({ id, tokenVersion, refreshVersion, type: 'refresh' }, process.env.JWT_SECRET, { expiresIn: REFRESH_TOKEN_TTL })

const buildAuthPayload = (user) => ({
  token: generateAccessToken(user._id, user.tokenVersion),
  refreshToken: generateRefreshToken(user._id, user.tokenVersion, user.refreshVersion),
  user,
})

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
    res.status(201).json({ message: 'Account created successfully.', ...buildAuthPayload(newUser) })
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
    res.json(buildAuthPayload(user))
  } catch (error) {
    handleError(res, error)
  }
}

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body
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
      return res.status(401).json({ message: 'Session revoked. Please sign in again.' })
    }
    if (user.refreshVersion !== decoded.refreshVersion) {
      user.tokenVersion = (user.tokenVersion || 0) + 1
      user.refreshVersion = (user.refreshVersion || 0) + 1
      await user.save()
      return res.status(401).json({ message: 'Refresh token reuse detected. Please sign in again.' })
    }
    user.refreshVersion = (user.refreshVersion || 0) + 1
    await user.save()
    res.json({ token: generateAccessToken(user._id, user.tokenVersion), refreshToken: generateRefreshToken(user._id, user.tokenVersion, user.refreshVersion), user })
  } catch (error) {
    handleError(res, error)
  }
}

const logout = async (req, res) => {
  try {
    req.user.tokenVersion = (req.user.tokenVersion || 0) + 1
    await req.user.save()
    res.json({ message: 'Logged out' })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { signup, login, refresh, logout }
