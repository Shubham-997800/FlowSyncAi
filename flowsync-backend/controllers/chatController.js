const ChatMessage = require('../models/ChatMessage')

const getChatHistory = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ user: req.user._id }).sort({ createdAt: 1 })
    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const saveChatMessage = async (req, res) => {
  try {
    const { role, text, tasks, createdTasks } = req.body
    const message = await ChatMessage.create({ user: req.user._id, role, text, tasks, createdTasks })
    res.status(201).json(message)
  } catch (error) {
    if (error.name === 'ValidationError') {
      const msgs = Object.values(error.errors).map(e => e.message).join(', ')
      return res.status(400).json({ message: msgs })
    }
    res.status(500).json({ message: error.message })
  }
}

const deleteChatMessage = async (req, res) => {
  try {
    const message = await ChatMessage.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!message) return res.status(404).json({ message: 'Message not found' })
    res.json({ message: 'Message deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const clearChatHistory = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ user: req.user._id })
    res.json({ message: 'Chat history cleared' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getChatHistory, saveChatMessage, deleteChatMessage, clearChatHistory }
