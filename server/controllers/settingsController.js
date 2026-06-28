const User = require('../models/User')

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    )
    res.json(user)
  } catch (error) {
    next(error)
  }
}

const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)

    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    user.password = newPassword
    await user.save()

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    next(error)
  }
}

const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id)
    res.json({ message: 'Account deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getProfile, updateProfile, updatePassword, deleteAccount }
