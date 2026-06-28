const { Router } = require('express')
const { getAnalytics, getWeeklyReport } = require('../controllers/analyticsController')
const { protect } = require('../middleware/auth')

const router = Router()
router.use(protect)

router.get('/', getAnalytics)
router.get('/weekly', getWeeklyReport)

module.exports = router
