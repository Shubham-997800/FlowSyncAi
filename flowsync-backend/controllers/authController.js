const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User')
const { sendResetEmail, sendVerificationEmail } = require('../services/emailService')
const { handleError } = require('../utils/errorHandler')

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString()
}

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    let user = await User.findOne({ email })
    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: 'An account with this email already exists. Try signing in.' })
      }
      const otp = generateOTP()
      user.name = name
      user.password = password
      user.verificationOTP = crypto.createHash('sha256').update(otp).digest('hex')
      user.verificationOTPExpire = Date.now() + 10 * 60 * 1000
      await user.save()
      try {
        await sendVerificationEmail(email, otp)
      } catch (emailErr) {
        console.error('Verification email send error:', emailErr.message)
      }
      return res.status(200).json({
        message: 'OTP resent. Verify your email to continue.',
        userId: user._id,
        email: user.email,
      })
    }
    const otp = generateOTP()
    user = await User.create({
      name, email, password,
      isVerified: false,
      verificationOTP: crypto.createHash('sha256').update(otp).digest('hex'),
      verificationOTPExpire: Date.now() + 10 * 60 * 1000,
    })
    try {
      await sendVerificationEmail(email, otp)
    } catch (emailErr) {
      console.error('Verification email send error:', emailErr.message)
    }
    res.status(201).json({
      message: 'Account created. Please verify your email.',
      userId: user._id,
      email: user.email,
    })
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

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' })

    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex')
    const user = await User.findOne({
      email,
      verificationOTP: hashedOTP,
      verificationOTPExpire: { $gt: Date.now() },
    })
    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' })

    user.isVerified = true
    user.verificationOTP = undefined
    user.verificationOTPExpire = undefined
    await user.save()

    res.json({ token: generateToken(user._id), user, message: 'Email verified successfully' })
  } catch (error) {
    handleError(res, error)
  }
}

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email is required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(200).json({ message: 'If an account exists, an OTP has been sent' })
    if (user.isVerified) return res.status(400).json({ message: 'Email already verified. Try signing in instead.' })

    const otp = generateOTP()
    user.verificationOTP = crypto.createHash('sha256').update(otp).digest('hex')
    user.verificationOTPExpire = Date.now() + 10 * 60 * 1000
    await user.save()

    try {
      await sendVerificationEmail(email, otp)
      res.json({ message: 'OTP resent to your email' })
    } catch (emailErr) {
      user.verificationOTP = undefined
      user.verificationOTPExpire = undefined
      await user.save()
      console.error('Resend OTP email error:', emailErr.message)
      res.status(500).json({ message: 'OTP could not be sent' })
    }
  } catch (error) {
    handleError(res, error)
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before signing in. Check your inbox for the OTP.', needsVerification: true, email: user.email })
    }
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

module.exports = { signup, login, forgotPassword, resetPassword, verifyEmail, resendOTP }
