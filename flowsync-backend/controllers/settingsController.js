const { handleError } = require('../utils/errorHandler')
const User = require('../models/User')

function isValidUrl(str) {
  if (!str) return true
  return /^https?:\/\/.+/.test(str) || /^data:image\//.test(str)
}

const getProfile = async (req, res) => {
  try {
    res.json(req.user)
  } catch (error) {
    handleError(res, error)
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, email, bio, phone, location, jobTitle, currentPassword } = req.body
    const updates = {}
    if (name !== undefined) updates.name = name
    if (email !== undefined && email !== req.user.email) {
      if (!currentPassword) return res.status(400).json({ message: 'Invalid password' })
      const user = await User.findById(req.user._id)
      if (!(await user.comparePassword(currentPassword))) return res.status(400).json({ message: 'Invalid password' })
      updates.email = email
      updates.isVerified = false
    }
    if (bio !== undefined) {
      if (bio.length > 500) return res.status(400).json({ message: 'Bio too long (max 500)' })
      updates.bio = bio
    }
    if (phone !== undefined) {
      if (phone && !/^[\d\s\-+().]{7,20}$/.test(phone)) return res.status(400).json({ message: 'Invalid phone number' })
      updates.phone = phone
    }
    if (location !== undefined) updates.location = location
    if (jobTitle !== undefined) updates.jobTitle = jobTitle
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    )
    res.json(user)
  } catch (error) {
    handleError(res, error)
  }
}

const uploadAvatar = async (req, res) => {
  try {
    const { profilePicture } = req.body
    if (!isValidUrl(profilePicture)) return res.status(400).json({ message: 'Invalid image URL' })
    if (profilePicture && profilePicture.length > 500000) return res.status(400).json({ message: 'Image data too large' })
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: profilePicture || '' },
      { new: true }
    )
    res.json(user)
  } catch (error) {
    handleError(res, error)
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
    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    handleError(res, error)
  }
}

const Task = require('../models/Task')
const Goal = require('../models/Goal')
const Habit = require('../models/Habit')
const Notification = require('../models/Notification')

const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body
    if (!password) return res.status(400).json({ message: 'Password required to delete account' })
    const user = await User.findById(req.user._id)
    if (!(await user.comparePassword(password))) return res.status(400).json({ message: 'Password is incorrect' })
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
    handleError(res, error)
  }
}

const updateAchievements = async (req, res) => {
  try {
    const { achievements } = req.body
    if (!Array.isArray(achievements)) return res.status(400).json({ message: 'Achievements array required' })
    for (const a of achievements) {
      if (typeof a.name !== 'string' || a.name.length > 100) return res.status(400).json({ message: 'Invalid achievement name' })
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { achievements },
      { new: true }
    )
    res.json({ achievements: user.achievements })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getProfile, updateProfile, updatePassword, deleteAccount, uploadAvatar, updateAchievements }
