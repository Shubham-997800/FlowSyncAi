const mongoose = require('mongoose')

// One document per logged-in device. Keyed by the refresh token's jti so
// individual devices can be revoked without affecting other sessions.
const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jti: { type: String, required: true },
  device: { type: String, default: 'Unknown device' },
  browser: { type: String, default: 'Unknown browser' },
  os: { type: String, default: 'Unknown OS' },
  ip: { type: String, default: '' },
  lastActive: { type: Date, default: Date.now },
}, { timestamps: true })

sessionSchema.index({ user: 1, jti: 1 }, { unique: true })
sessionSchema.index({ user: 1, lastActive: -1 })

module.exports = mongoose.model('Session', sessionSchema)
