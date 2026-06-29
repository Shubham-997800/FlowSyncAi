const { Router } = require('express')
const { getNotifications, markRead, createNotification } = require('../controllers/notificationController')
const { protect } = require('../middleware/auth')
const { generalLimiter } = require('../middleware/rateLimiter')

const router = Router()
router.use(protect)
router.use(generalLimiter)

router.get('/', getNotifications)
router.post('/', createNotification)
router.put('/:id/read', markRead)

module.exports = router
