const { Router } = require('express')
const { getNotifications, markAsRead, markAllAsRead, deleteNotification } = require('../controllers/notificationController')
const { protect } = require('../middleware/auth')

const router = Router()
router.use(protect)

router.get('/', getNotifications)
router.put('/read-all', markAllAsRead)
router.route('/:id').put(markAsRead).delete(deleteNotification)

module.exports = router
