const ChatMessage = require('../models/ChatMessage')

const { handleError, handleValidationError } = require('../utils/errorHandler')
const getChatSessions = async (req, res) => {
  try {
    const sessions = await ChatMessage.aggregate([
      { $match: { user: req.user._id } },
      { $sort: { createdAt: 1 } },
      { $group: {
        _id: '$sessionId',
        createdAt: { $last: '$createdAt' },
        messageCount: { $sum: 1 },
        preview: { $first: '$text' },
      }},
      { $sort: { createdAt: -1 } },
    ])
    res.json(sessions)
  } catch (error) {
    handleError(res, error)
  }
}

const getChatHistory = async (req, res) => {
  try {
    const filter = { user: req.user._id }
    if (req.query.sessionId) filter.sessionId = req.query.sessionId
    const messages = await ChatMessage.find(filter).sort({ createdAt: 1 })
    res.json(messages)
  } catch (error) {
    handleError(res, error)
  }
}

const { MAX_CHAT_SESSIONS } = require('../config/constants')

const saveChatMessage = async (req, res) => {
  try {
    const { sessionId, role, text, tasks, createdTasks } = req.body
    if (!sessionId) return res.status(400).json({ message: 'sessionId is required' })
    const message = await ChatMessage.create({ user: req.user._id, sessionId, role, text, tasks, createdTasks })
    const sessions = await ChatMessage.distinct('sessionId', { user: req.user._id })
    if (sessions.length > MAX_CHAT_SESSIONS) {
      const oldSessions = await ChatMessage.aggregate([
        { $match: { user: req.user._id } },
        { $sort: { createdAt: 1 } },
        { $group: { _id: '$sessionId', lastMsg: { $last: '$createdAt' } } },
        { $sort: { lastMsg: 1 } },
        { $limit: sessions.length - MAX_CHAT_SESSIONS },
      ])
      for (const s of oldSessions) {
        await ChatMessage.deleteMany({ user: req.user._id, sessionId: s._id })
      }
    }
    res.status(201).json(message)
  } catch (error) {
    return handleValidationError(res, error)
  }
}

const deleteChatMessage = async (req, res) => {
  try {
    const message = await ChatMessage.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!message) return res.status(404).json({ message: 'Message not found' })
    res.json({ message: 'Message deleted' })
  } catch (error) {
    handleError(res, error)
  }
}

const clearChatHistory = async (req, res) => {
  try {
    if (!req.query.sessionId) return res.status(400).json({ message: 'sessionId is required to clear history' })
    const filter = { user: req.user._id, sessionId: req.query.sessionId }
    await ChatMessage.deleteMany(filter)
    res.json({ message: 'Chat history cleared' })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getChatSessions, getChatHistory, saveChatMessage, deleteChatMessage, clearChatHistory }
