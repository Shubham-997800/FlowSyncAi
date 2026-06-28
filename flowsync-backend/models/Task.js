const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: [true, 'Title is required'], trim: true },
  description: { type: String, trim: true, default: '' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
  deadline: { type: Date, default: null },
  estimatedTime: { type: Number, default: null },
  aiRiskScore: { type: Number, min: 0, max: 100, default: null },
  aiSuggestedOrder: { type: Number, default: null },
}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)
