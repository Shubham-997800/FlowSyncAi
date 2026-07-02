const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { handleError } = require('../utils/errorHandler')

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists. Try signing in.' })
    }
    const newUser = await User.create({ name, email, password })
    const token = generateToken(newUser._id)
    res.status(201).json({ message: 'Account created successfully.', token, user: newUser })
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

module.exports = { signup, login }
