const mongoose = require('mongoose')

const aiUsageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  count: { type: Number, default: 0 },
  // Server-set creation time used for TTL cleanup of old usage rows.
  createdAt: { type: Date, default: Date.now },
})

aiUsageSchema.index({ user: 1, date: 1 }, { unique: true })
// Expire usage rows after ~13 months so the collection cannot grow forever.
aiUsageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 400 })

module.exports = mongoose.model('AiUsage', aiUsageSchema)
