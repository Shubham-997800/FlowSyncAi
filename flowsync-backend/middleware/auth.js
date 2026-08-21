const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Session = require('../models/Session')

const protect = async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) return res.status(401).json({ message: 'Not authorized' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    if (!req.user) return res.status(401).json({ message: 'User not found' })
    if (decoded.type === 'refresh' || (decoded.tokenVersion !== undefined && decoded.tokenVersion !== req.user.tokenVersion)) {
      return res.status(401).json({ message: 'Token invalid' })
    }
    if (decoded.jti) {
      // Per-device revocation: the session row must still exist. Tokens
      // issued before sessions existed (no jti) keep working until their
      // natural expiry so no user is ever force-logged-out by a deploy.
      const alive = await Session.exists({ user: req.user._id, jti: decoded.jti })
      if (!alive) return res.status(401).json({ message: 'Session revoked' })
      req.authJti = decoded.jti
    }
    next()
  } catch {
    return res.status(401).json({ message: 'Token invalid' })
  }
}

module.exports = { protect }
