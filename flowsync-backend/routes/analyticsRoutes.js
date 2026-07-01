const { Router } = require('express')
const { getWeekly, getMonthly, getStats } = require('../controllers/analyticsController')
const { protect } = require('../middleware/auth')
const { generalLimiter } = require('../middleware/rateLimiter')

const router = Router()
router.use(generalLimiter)
router.use(protect)

router.get('/weekly', getWeekly)
router.get('/monthly', getMonthly)
router.get('/stats', getStats)

module.exports = router
