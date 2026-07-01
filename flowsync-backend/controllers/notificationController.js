const Notification = require('../models/Notification')

const { handleError, handleValidationError } = require('../utils/errorHandler')
const allowedFields = ['type', 'title', 'message', 'link']

function sanitize(body) {
  const safe = {}
  for (const key of allowedFields) {
    if (body[key] !== undefined) safe[key] = body[key]
  }
  return safe
}

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50)
    res.json(notifications)
  } catch (error) {
    handleError(res, error)
  }
}

const markRead = async (req, res) => {
  try {
    const n = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: 'read' },
      { new: true }
    )
    if (!n) return res.status(404).json({ message: 'Not found' })
    res.json(n)
  } catch (error) {
    handleError(res, error)
  }
}

const createNotification = async (req, res) => {
  try {
    const n = await Notification.create({ ...sanitize(req.body), user: req.user._id })
    res.status(201).json(n)
  } catch (error) {
    return handleValidationError(res, error)
  }
}

module.exports = { getNotifications, markRead, createNotification }
