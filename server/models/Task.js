const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending',
  },
  dueDate: {
    type: Date,
    default: null,
  },
  estimatedDuration: {
    type: Number,
    default: null,
  },
  aiSuggestedSchedule: {
    type: String,
    default: null,
  },
}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)
