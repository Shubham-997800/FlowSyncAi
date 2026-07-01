const ChatMessage = require('../models/ChatMessage')

const getChatSessions = async (req, res) => {
  try {
    const sessions = await ChatMessage.aggregate([
      { $match: { user: req.user._id } },
      { $sort: { createdAt: -1 } },
      { $group: {
        _id: '$sessionId',
        createdAt: { $first: '$createdAt' },
        messageCount: { $sum: 1 },
        preview: { $first: '$text' },
      }},
      { $sort: { createdAt: -1 } },
    ])
    res.json(sessions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getChatHistory = async (req, res) => {
  try {
    const filter = { user: req.user._id }
    if (req.query.sessionId) filter.sessionId = req.query.sessionId
    const messages = await ChatMessage.find(filter).sort({ createdAt: 1 })
    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const saveChatMessage = async (req, res) => {
  try {
    const { sessionId, role, text, tasks, createdTasks } = req.body
    if (!sessionId) return res.status(400).json({ message: 'sessionId is required' })
    const message = await ChatMessage.create({ user: req.user._id, sessionId, role, text, tasks, createdTasks })
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
    const filter = { user: req.user._id }
    if (req.query.sessionId) filter.sessionId = req.query.sessionId
    await ChatMessage.deleteMany(filter)
    res.json({ message: 'Chat history cleared' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getChatSessions, getChatHistory, saveChatMessage, deleteChatMessage, clearChatHistory }
