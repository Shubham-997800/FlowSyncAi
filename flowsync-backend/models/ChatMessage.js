const mongoose = require('mongoose')

const chatMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['user', 'ai'], required: true },
  text: { type: String, required: true },
  tasks: [{
    title: String,
    description: String,
    priority: String,
    deadline: String,
  }],
  createdTasks: [{
    _id: String,
    title: String,
    description: String,
    priority: String,
    deadline: String,
  }],
}, { timestamps: true })

chatMessageSchema.index({ user: 1, createdAt: -1 })

module.exports = mongoose.model('ChatMessage', chatMessageSchema)
