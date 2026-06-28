const Task = require('../models/Task')

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) { next(error) }
}

const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user._id })
    res.status(201).json(task)
  } catch (error) { next(error) }
}

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    )
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (error) { next(error) }
}

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json({ message: 'Task deleted' })
  } catch (error) { next(error) }
}

module.exports = { getTasks, createTask, updateTask, deleteTask }
