const Task = require('../models/Task')

const { handleError, handleValidationError } = require('../utils/errorHandler')
const { sanitizeBody } = require('../utils/sanitize')
const { parsePagination } = require('../utils/pagination')
const allowedTaskFields = ['title', 'description', 'priority', 'status', 'deadline', 'estimatedTime', 'tags']
const textFields = ['title', 'description']

const getTasks = async (req, res) => {
  try {
    const filter = { user: req.user._id }
    const { skip, limit } = parsePagination(req.query)
    const total = await Task.countDocuments(filter)
    const tasks = await Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
    res.set('X-Total-Count', total)
    res.json(tasks)
  } catch (error) {
    handleError(res, error)
  }
}

const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (error) {
    handleError(res, error)
  }
}

const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...sanitizeBody(req.body, allowedTaskFields, textFields), user: req.user._id })
    res.status(201).json(task)
  } catch (error) {
    return handleValidationError(res, error)
  }
}

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      sanitizeBody(req.body, allowedTaskFields, textFields),
      { returnDocument: 'after', runValidators: true }
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

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask }
