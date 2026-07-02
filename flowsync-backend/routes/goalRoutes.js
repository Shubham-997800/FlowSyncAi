const { Router } = require('express')
const { getGoals, createGoal, updateGoal, deleteGoal } = require('../controllers/goalController')
const { protect } = require('../middleware/auth')
const { generalLimiter } = require('../middleware/rateLimiter')
const { validateObjectId } = require('../utils/validateId')

const router = Router()
router.use(generalLimiter)
router.use(protect)

router.route('/').get(getGoals).post(createGoal)
router.route('/:id').all(validateObjectId).put(updateGoal).delete(deleteGoal)

module.exports = router
