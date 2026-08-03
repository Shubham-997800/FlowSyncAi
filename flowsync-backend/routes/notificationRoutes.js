const { Router } = require('express')
const { getNotifications, markRead, createNotification, deleteNotification } = require('../controllers/notificationController')
const { protect } = require('../middleware/auth')
const { generalLimiter } = require('../middleware/rateLimiter')
const { validateObjectId } = require('../utils/validateId')

const router = Router()
router.use(generalLimiter)
router.use(protect)

router.get('/', getNotifications)
router.post('/', createNotification)
router.put('/:id/read', validateObjectId, markRead)
router.delete('/:id', validateObjectId, deleteNotification)

module.exports = router
