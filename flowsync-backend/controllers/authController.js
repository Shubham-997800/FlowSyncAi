const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const User = require('../models/User')

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

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

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body
    if (!credential) return res.status(400).json({ message: 'Google credential required' })

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    const { email, name, picture } = payload

    let user = await User.findOne({ email })
    if (!user) {
      user = await User.create({ name, email, password: '', profilePicture: picture || '' })
    }

    res.json({ token: generateToken(user._id), user })
  } catch (error) {
    console.error('Google login error:', error.message)
    res.status(401).json({ message: 'Google authentication failed' })
  }
}

module.exports = { signup, login, googleLogin }
