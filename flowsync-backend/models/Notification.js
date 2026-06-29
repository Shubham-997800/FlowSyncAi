const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deadline_alert', 'ai_suggestion', 'reminder', 'system', 'success', 'info', 'alert'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String, default: '' },
  status: { type: String, enum: ['unread', 'read', 'dismissed'], default: 'unread' },
}, { timestamps: true })

notificationSchema.index({ user: 1, createdAt: -1 })

module.exports = mongoose.model('Notification', notificationSchema)
