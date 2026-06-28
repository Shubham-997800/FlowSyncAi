const { Router } = require('express')
const { getGoals, createGoal, updateGoal, deleteGoal } = require('../controllers/goalController')
const { protect } = require('../middleware/auth')

const router = Router()
router.use(protect)

router.route('/').get(getGoals).post(createGoal)
router.route('/:id').put(updateGoal).delete(deleteGoal)

module.exports = router
