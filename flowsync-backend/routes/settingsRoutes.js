const { Router } = require('express')
const { getProfile, updateProfile, updatePassword, deleteAccount, uploadAvatar, updateAchievements } = require('../controllers/settingsController')
const { protect } = require('../middleware/auth')
const { generalLimiter } = require('../middleware/rateLimiter')

const router = Router()
router.use(generalLimiter)
router.use(protect)

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.put('/avatar', uploadAvatar)
router.put('/password', updatePassword)
router.put('/achievements', updateAchievements)
router.delete('/account', deleteAccount)

module.exports = router
