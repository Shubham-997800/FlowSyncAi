const mongoose = require('mongoose')

const aiUsageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  count: { type: Number, default: 0 },
}, { timestamps: true })

aiUsageSchema.index({ user: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('AiUsage', aiUsageSchema)
