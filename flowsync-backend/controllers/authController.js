const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User')
const { sendResetEmail } = require('../services/emailService')
const { handleError } = require('../utils/errorHandler')

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'An account with this email already exists. Try signing in.' })
    }
    user = await User.create({ name, email, password, isVerified: true })
    const token = generateToken(user._id)
    res.status(201).json({ message: 'Account created successfully.', token, user })
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
    res.json({ token: generateToken(user._id), user })
  } catch (error) {
    handleError(res, error)
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email is required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(200).json({ message: 'If an account exists, a reset link has been sent' })

    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000
    await user.save()

    sendResetEmail(email, resetToken).catch(err => {
      console.error('Email send error:', err.message)
    })
    res.json({ message: 'Reset link sent to your email' })
  } catch (error) {
    handleError(res, error)
  }
}

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body
    if (!token || !password) return res.status(400).json({ message: 'Token and password are required' })

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    })
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' })

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.json({ message: 'Password reset successful' })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { signup, login, forgotPassword, resetPassword }
