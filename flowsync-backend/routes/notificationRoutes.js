const { Router } = require('express')
const { getNotifications, markRead, createNotification } = require('../controllers/notificationController')
const { protect } = require('../middleware/auth')

const router = Router()
router.use(protect)

router.get('/', getNotifications)
router.post('/', createNotification)
router.put('/:id/read', markRead)

module.exports = router
