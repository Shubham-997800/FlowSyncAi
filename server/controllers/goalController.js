const Goal = require('../models/Goal')

const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(goals)
  } catch (error) {
    next(error)
  }
}

const createGoal = async (req, res, next) => {
  try {
    const goal = await Goal.create({ ...req.body, user: req.user._id })
    res.status(201).json(goal)
  } catch (error) {
    next(error)
  }
}

const updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    )
    if (!goal) return res.status(404).json({ message: 'Goal not found' })
    res.json(goal)
  } catch (error) {
    next(error)
  }
}

const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!goal) return res.status(404).json({ message: 'Goal not found' })
    res.json({ message: 'Goal deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getGoals, createGoal, updateGoal, deleteGoal }
