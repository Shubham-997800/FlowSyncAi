const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

const signup = async (req, res) => {
  const { name, email, password } = req.body
  if (await User.findOne({ email })) {
    return res.status(400).json({ message: 'User already exists' })
  }
  const user = await User.create({ name, email, password })
  res.status(201).json({ token: generateToken(user._id), user })
}

const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }
  res.json({ token: generateToken(user._id), user })
}

module.exports = { signup, login }
