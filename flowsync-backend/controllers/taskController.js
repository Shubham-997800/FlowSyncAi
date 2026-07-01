const Task = require('../models/Task')

const { handleError, handleValidationError } = require('../utils/errorHandler')
const allowedTaskFields = ['title', 'description', 'priority', 'status', 'deadline', 'estimatedTime', 'tags']

function sanitize(body) {
  const safe = {}
  for (const key of allowedTaskFields) {
    if (body[key] !== undefined) safe[key] = body[key]
  }
  return safe
}

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    handleError(res, error)
  }
}

const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...sanitize(req.body), user: req.user._id })
    res.status(201).json(task)
  } catch (error) {
    return handleValidationError(res, error)
  }
}

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      sanitize(req.body),
      { new: true, runValidators: true }
    )
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (error) {
    return handleValidationError(res, error)
  }
}

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json({ message: 'Task deleted' })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getTasks, createTask, updateTask, deleteTask }
