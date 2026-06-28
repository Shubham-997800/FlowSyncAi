const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['deadline_alert', 'ai_alert', 'reminder', 'system'],
    default: 'reminder',
  },
  read: {
    type: Boolean,
    default: false,
  },
  relatedTo: {
    model: {
      type: String,
      enum: ['Task', 'Goal', 'Habit'],
      default: null,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
}, { timestamps: true })

module.exports = mongoose.model('Notification', notificationSchema)
