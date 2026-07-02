const { Router } = require('express')
const { getHabits, createHabit, updateHabit, deleteHabit, checkInHabit } = require('../controllers/habitController')
const { protect } = require('../middleware/auth')
const { generalLimiter } = require('../middleware/rateLimiter')
const { validateObjectId } = require('../utils/validateId')

const router = Router()
router.use(generalLimiter)
router.use(protect)

router.route('/').get(getHabits).post(createHabit)
router.route('/:id').all(validateObjectId).put(updateHabit).delete(deleteHabit)
router.post('/:id/checkin', validateObjectId, checkInHabit)

module.exports = router
