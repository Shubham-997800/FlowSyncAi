const mongoose = require('mongoose')

const goalSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['long_term', 'short_term'],
    default: 'short_term',
  },
  targetDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started',
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  milestones: [
    {
      title: { type: String, required: true },
      completed: { type: Boolean, default: false },
    },
  ],
}, { timestamps: true })

module.exports = mongoose.model('Goal', goalSchema)
