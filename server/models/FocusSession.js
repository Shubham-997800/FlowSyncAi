const mongoose = require('mongoose')

const focusSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null,
  },
  duration: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['pomodoro', 'custom'],
    default: 'pomodoro',
  },
  completed: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true })

module.exports = mongoose.model('FocusSession', focusSessionSchema)
