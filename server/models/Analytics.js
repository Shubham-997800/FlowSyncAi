const mongoose = require('mongoose')

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  totalTasks: {
    type: Number,
    default: 0,
  },
  completedTasks: {
    type: Number,
    default: 0,
  },
  totalFocusHours: {
    type: Number,
    default: 0,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  productivityScore: {
    type: Number,
    default: 0,
  },
  weeklyData: [
    {
      date: Date,
      tasksCompleted: Number,
      focusMinutes: Number,
    },
  ],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true })

module.exports = mongoose.model('Analytics', analyticsSchema)
