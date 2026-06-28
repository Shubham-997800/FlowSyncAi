const { Router } = require('express')
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController')
const { protect } = require('../middleware/auth')

const router = Router()

router.use(protect)

router.route('/')
  .get(getTasks)
  .post(createTask)

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask)

module.exports = router
