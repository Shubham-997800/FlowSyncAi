const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User')
const { sendResetEmail } = require('../services/emailService')

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const user = await User.create({ name, email, password })
    res.status(201).json({ token: generateToken(user._id), user })
  } catch (error) {
    console.error('Signup error:', error.message, error.name)
    if (error.name === 'ValidationError') {
      const msgs = Object.values(error.errors).map(e => e.message).join(', ')
      return res.status(400).json({ message: msgs })
    }
    if (error.code === 11000) return res.status(400).json({ message: 'Duplicate field' })
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid ID' })
    res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    res.json({ token: generateToken(user._id), user })
  } catch (error) {
    console.error('Login error:', error.message)
    res.status(500).json({ message: error.message })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email is required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'No account with that email' })

    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000
    await user.save()

    try {
      await sendResetEmail(email, resetToken)
      res.json({ message: 'Reset link sent to your email' })
    } catch (emailErr) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined
      await user.save()
      console.error('Email send error:', emailErr.message)
      res.status(500).json({ message: 'Email could not be sent' })
    }
  } catch (error) {
    console.error('Forgot password error:', error.message)
    res.status(500).json({ message: error.message })
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
    console.error('Reset password error:', error.message)
    res.status(500).json({ message: error.message })
  }
}

module.exports = { signup, login, forgotPassword, resetPassword }
