const Notification = require('../models/Notification')

const { handleError, handleValidationError } = require('../utils/errorHandler')
const { sanitizeBody } = require('../utils/sanitize')
const { parsePagination } = require('../utils/pagination')
const allowedFields = ['type', 'title', 'message', 'link']
const textFields = ['title', 'message']

const getNotifications = async (req, res) => {
  try {
    const filter = { user: req.user._id }
    const { skip, limit } = parsePagination(req.query, { limit: 100 })
    const total = await Notification.countDocuments(filter)
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
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
      { returnDocument: 'after' }
    )
    if (!n) return res.status(404).json({ message: 'Not found' })
    res.json(n)
  } catch (error) {
    handleError(res, error)
  }
}

const markAllRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user._id, status: 'unread' },
      { status: 'read' }
    )
    res.json({ updated: result.modifiedCount })
  } catch (error) {
    handleError(res, error)
  }
}

const createNotification = async (req, res) => {
  try {
    const n = await Notification.create({ ...sanitizeBody(req.body, allowedFields, textFields), user: req.user._id })
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

const deleteAllNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({ user: req.user._id })
    res.json({ deleted: result.deletedCount })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getNotifications, markRead, markAllRead, createNotification, deleteNotification, deleteAllNotifications }
