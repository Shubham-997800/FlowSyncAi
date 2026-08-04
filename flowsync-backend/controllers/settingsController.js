const { handleError, handleValidationError } = require('../utils/errorHandler')
const { sanitizeText } = require('../utils/sanitize')
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
    if (name !== undefined) {
      if (typeof name !== 'string' || name.length > 100) return res.status(400).json({ message: 'Name too long (max 100)' })
      updates.name = sanitizeText(name)
    }
    if (email !== undefined && email !== req.user.email) {
      if (typeof email !== 'string') return res.status(400).json({ message: 'Invalid email' })
      if (!currentPassword) return res.status(400).json({ message: 'Invalid password' })
      const user = await User.findById(req.user._id)
      if (!(await user.comparePassword(currentPassword))) return res.status(400).json({ message: 'Invalid password' })
      updates.email = email
      updates.isVerified = false
    }
    if (bio !== undefined) {
      if (typeof bio !== 'string' || bio.length > 500) return res.status(400).json({ message: 'Bio too long (max 500)' })
      updates.bio = sanitizeText(bio)
    }
    if (phone !== undefined) {
      if (phone && !/^[\d\s\-+().]{7,20}$/.test(phone)) return res.status(400).json({ message: 'Invalid phone number' })
      updates.phone = phone
    }
    if (location !== undefined) {
      if (typeof location !== 'string' || location.length > 200) return res.status(400).json({ message: 'Location too long (max 200)' })
      updates.location = sanitizeText(location)
    }
    if (jobTitle !== undefined) {
      if (typeof jobTitle !== 'string' || jobTitle.length > 100) return res.status(400).json({ message: 'Job title too long (max 100)' })
      updates.jobTitle = sanitizeText(jobTitle)
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    )
    res.json(user)
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Email already in use' })
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid value' })
    return handleValidationError(res, error)
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
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({ message: 'Current and new password are required' })
    }
    const user = await User.findById(req.user._id)
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }
    user.password = newPassword
    user.tokenVersion = (user.tokenVersion || 0) + 1
    await user.save()
    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    return handleValidationError(res, error)
  }
}

const Task = require('../models/Task')
const Goal = require('../models/Goal')
const Habit = require('../models/Habit')
const Notification = require('../models/Notification')
const ChatMessage = require('../models/ChatMessage')
const PushSubscription = require('../models/PushSubscription')
const AiUsage = require('../models/AiUsage')

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
      ChatMessage.deleteMany({ user: userId }),
      PushSubscription.deleteMany({ user: userId }),
      AiUsage.deleteMany({ user: userId }),
    ])
    res.json({ message: 'Account deleted' })
  } catch (error) {
    handleError(res, error)
  }
}

const AI_SETTINGS_DEFAULTS = { aggressiveness: 'medium', autoScheduling: true, smartPrioritization: true, rescueMode: false, quality: 'medium' }

const getAiSettings = async (req, res) => {
  try {
    const current = req.user.aiSettings ? req.user.aiSettings.toObject() : {}
    res.json({ ...AI_SETTINGS_DEFAULTS, ...current })
  } catch (error) {
    handleError(res, error)
  }
}

const updateAiSettings = async (req, res) => {
  try {
    const { aggressiveness, autoScheduling, smartPrioritization, rescueMode, quality } = req.body
    const updates = {}
    if (aggressiveness !== undefined) {
      if (!['low', 'medium', 'high'].includes(aggressiveness)) {
        return res.status(400).json({ message: 'Invalid aggressiveness' })
      }
      updates['aiSettings.aggressiveness'] = aggressiveness
    }
    if (autoScheduling !== undefined) updates['aiSettings.autoScheduling'] = Boolean(autoScheduling)
    if (smartPrioritization !== undefined) updates['aiSettings.smartPrioritization'] = Boolean(smartPrioritization)
    if (rescueMode !== undefined) updates['aiSettings.rescueMode'] = Boolean(rescueMode)
    if (quality !== undefined) {
      if (!['low', 'medium', 'high'].includes(quality)) {
        return res.status(400).json({ message: 'Invalid quality' })
      }
      updates['aiSettings.quality'] = quality
    }
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true })
    const current = user.aiSettings ? user.aiSettings.toObject() : {}
    res.json({ ...AI_SETTINGS_DEFAULTS, ...current })
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

module.exports = { getProfile, updateProfile, updatePassword, deleteAccount, uploadAvatar, updateAchievements, getAiSettings, updateAiSettings }
