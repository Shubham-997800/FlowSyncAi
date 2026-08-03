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
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 200)
    const filter = { user: req.user._id }
    const total = await Notification.countDocuments(filter)
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
    res.set('X-Total-Count', total)
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

const deleteNotification = async (req, res) => {
  try {
    const n = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!n) return res.status(404).json({ message: 'Not found' })
    res.json({ message: 'Notification deleted' })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getNotifications, markRead, createNotification, deleteNotification }
