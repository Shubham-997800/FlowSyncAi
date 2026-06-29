const Habit = require('../models/Habit')

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
    res.status(500).json({ message: error.message })
  }
}

const createHabit = async (req, res) => {
  try {
    const habit = await Habit.create({ ...sanitize(req.body), user: req.user._id })
    res.status(201).json(habit)
  } catch (error) {
    if (error.name === 'ValidationError') {
      const msgs = Object.values(error.errors).map(e => e.message).join(', ')
      return res.status(400).json({ message: msgs })
    }
    res.status(500).json({ message: error.message })
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
    if (error.name === 'ValidationError') {
      const msgs = Object.values(error.errors).map(e => e.message).join(', ')
      return res.status(400).json({ message: msgs })
    }
    res.status(500).json({ message: error.message })
  }
}

const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!habit) return res.status(404).json({ message: 'Habit not found' })
    res.json({ message: 'Habit deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
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
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getHabits, createHabit, updateHabit, deleteHabit, checkInHabit }
