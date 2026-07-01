const User = require('../models/User')

const getProfile = async (req, res) => {
  try {
    res.json(req.user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, email, bio, phone, location, jobTitle } = req.body
    const updates = {}
    if (name !== undefined) updates.name = name
    if (email !== undefined) updates.email = email
    if (bio !== undefined) updates.bio = bio
    if (phone !== undefined) updates.phone = phone
    if (location !== undefined) updates.location = location
    if (jobTitle !== undefined) updates.jobTitle = jobTitle
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    )
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const uploadAvatar = async (req, res) => {
  try {
    const { profilePicture } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture },
      { new: true }
    )
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }
    user.password = newPassword
    await user.save()
    res.json({ message: 'Password updated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const Task = require('../models/Task')
const Goal = require('../models/Goal')
const Habit = require('../models/Habit')
const Notification = require('../models/Notification')

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id
    await Promise.all([
      User.findByIdAndDelete(userId),
      Task.deleteMany({ user: userId }),
      Goal.deleteMany({ user: userId }),
      Habit.deleteMany({ user: userId }),
      Notification.deleteMany({ user: userId }),
    ])
    res.json({ message: 'Account deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const toggleAIConsent = async (req, res) => {
  try {
    const { consent } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { aiConsent: !!consent },
      { new: true }
    )
    res.json({ aiConsent: user.aiConsent })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getProfile, updateProfile, updatePassword, deleteAccount, uploadAvatar, toggleAIConsent }
