const Notification = require('../models/Notification')

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50)
    res.json(notifications)
  } catch (error) {
    res.status(500).json({ message: error.message })
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
    res.status(500).json({ message: error.message })
  }
}

const createNotification = async (req, res) => {
  try {
    const n = await Notification.create({ ...req.body, user: req.user._id })
    res.status(201).json(n)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getNotifications, markRead, createNotification }
