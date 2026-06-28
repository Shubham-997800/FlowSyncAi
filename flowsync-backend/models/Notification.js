const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deadline_alert', 'ai_suggestion', 'reminder', 'system'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'dismissed'], default: 'unread' },
}, { timestamps: true })

module.exports = mongoose.model('Notification', notificationSchema)
