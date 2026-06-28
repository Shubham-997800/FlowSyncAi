const Habit = require('../models/Habit')

const getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(habits)
  } catch (error) {
    next(error)
  }
}

const createHabit = async (req, res, next) => {
  try {
    const habit = await Habit.create({ ...req.body, user: req.user._id })
    res.status(201).json(habit)
  } catch (error) {
    next(error)
  }
}

const updateHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    )
    if (!habit) return res.status(404).json({ message: 'Habit not found' })
    res.json(habit)
  } catch (error) {
    next(error)
  }
}

const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!habit) return res.status(404).json({ message: 'Habit not found' })
    res.json({ message: 'Habit deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getHabits, createHabit, updateHabit, deleteHabit }
