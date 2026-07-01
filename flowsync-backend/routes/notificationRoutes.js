const { Router } = require('express')
const { getNotifications, markRead, createNotification } = require('../controllers/notificationController')
const { protect } = require('../middleware/auth')
const { generalLimiter } = require('../middleware/rateLimiter')

const router = Router()
router.use(generalLimiter)
router.use(protect)

router.get('/', getNotifications)
router.post('/', createNotification)
router.put('/:id/read', markRead)

module.exports = router
