const Habit = require('../models/Habit')

const { handleError, handleValidationError } = require('../utils/errorHandler')
const { localDateKey } = require('../utils/dateKey')
const { sanitizeBody } = require('../utils/sanitize')
const { parsePagination } = require('../utils/pagination')

// streak, logs and lastChecked are server-computed and must not be writable by clients.
const allowedFields = ['title', 'frequency', 'status']
const textFields = ['title']

const getHabits = async (req, res) => {
  try {
    const filter = { user: req.user._id }
    const { skip, limit } = parsePagination(req.query)
    const total = await Habit.countDocuments(filter)
    const habits = await Habit.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
    res.set('X-Total-Count', total)
    res.json(habits)
  } catch (error) {
    handleError(res, error)
  }
}

const createHabit = async (req, res) => {
  try {
    const habit = await Habit.create({ ...sanitizeBody(req.body, allowedFields, textFields), user: req.user._id })
    res.status(201).json(habit)
  } catch (error) {
    return handleValidationError(res, error)
  }
}

const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      sanitizeBody(req.body, allowedFields, textFields),
      { returnDocument: 'after', runValidators: true }
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
  const todayMs = today.getTime()
  const dates = [...new Set(logs)].map(d => {
    const [y, m, day] = d.split('-').map(Number)
    return new Date(y, m - 1, day).getTime()
  }).sort((a, b) => b - a)
  let streak = 0
  for (const ts of dates) {
    const expected = todayMs - streak * 86400000
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

    const today = localDateKey()
    if (!habit.logs.includes(today)) {
      habit.logs.push(today)
      // Cap log history (~13 months) so the document cannot grow unbounded.
      if (habit.logs.length > 400) habit.logs = habit.logs.slice(-400)
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
