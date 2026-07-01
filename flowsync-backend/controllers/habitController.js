const Habit = require('../models/Habit')

const { handleError, handleValidationError } = require('../utils/errorHandler')
const allowedFields = ['title', 'frequency', 'streak', 'lastChecked', 'logs', 'status']

function sanitize(body) {
  const safe = {}
  for (const key of allowedFields) {
    if (body[key] !== undefined) safe[key] = body[key]
  }
  return safe
}

const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(habits)
  } catch (error) {
    handleError(res, error)
  }
}

const createHabit = async (req, res) => {
  try {
    const habit = await Habit.create({ ...sanitize(req.body), user: req.user._id })
    res.status(201).json(habit)
  } catch (error) {
    return handleValidationError(res, error)
  }
}

const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      sanitize(req.body),
      { new: true, runValidators: true }
    )
    if (!habit) return res.status(404).json({ message: 'Habit not found' })
    res.json(habit)
  } catch (error) {
    return handleValidationError(res, error)
  }
}

const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!habit) return res.status(404).json({ message: 'Habit not found' })
    res.json({ message: 'Habit deleted' })
  } catch (error) {
    handleError(res, error)
  }
}

function calcStreak(logs) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dates = [...new Set(logs)].map(d => {
    const dt = new Date(d)
    dt.setHours(0, 0, 0, 0)
    return dt.getTime()
  }).sort((a, b) => b - a)
  let streak = 0
  const target = today.getTime()
  for (const ts of dates) {
    const expected = target - streak * 86400000
    if (ts === expected) {
      streak++
    } else if (ts < expected) {
      break
    }
  }
  return streak
}

const checkInHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id })
    if (!habit) return res.status(404).json({ message: 'Habit not found' })

    const today = new Date().toISOString().split('T')[0]
    if (!habit.logs.includes(today)) {
      habit.logs.push(today)
    }
    habit.lastChecked = new Date()
    habit.streak = calcStreak(habit.logs)
    await habit.save()
    res.json(habit)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getHabits, createHabit, updateHabit, deleteHabit, checkInHabit }
