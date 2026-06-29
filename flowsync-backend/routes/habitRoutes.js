const { Router } = require('express')
const { getHabits, createHabit, updateHabit, deleteHabit, checkInHabit } = require('../controllers/habitController')
const { protect } = require('../middleware/auth')

const router = Router()
router.use(protect)

router.route('/').get(getHabits).post(createHabit)
router.route('/:id').put(updateHabit).delete(deleteHabit)
router.post('/:id/checkin', checkInHabit)

module.exports = router
