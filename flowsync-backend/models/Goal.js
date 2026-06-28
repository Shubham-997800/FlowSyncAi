const mongoose = require('mongoose')

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: [true, 'Title is required'], trim: true },
  description: { type: String, trim: true, default: '' },
  targetDate: { type: Date, default: null },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  progress: { type: Number, min: 0, max: 100, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Goal', goalSchema)
