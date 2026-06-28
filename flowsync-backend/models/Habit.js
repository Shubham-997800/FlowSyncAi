const mongoose = require('mongoose')

const habitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: [true, 'Title is required'], trim: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'custom'], default: 'daily' },
  streak: { type: Number, default: 0 },
  lastChecked: { type: Date, default: null },
  logs: [{ type: String }],
  status: { type: String, enum: ['active', 'paused', 'archived'], default: 'active' },
}, { timestamps: true })

module.exports = mongoose.model('Habit', habitSchema)
