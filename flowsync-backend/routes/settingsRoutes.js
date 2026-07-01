const { Router } = require('express')
const { getProfile, updateProfile, updatePassword, deleteAccount, uploadAvatar, toggleAIConsent } = require('../controllers/settingsController')
const { protect } = require('../middleware/auth')

const router = Router()
router.use(protect)

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.put('/avatar', uploadAvatar)
router.put('/password', updatePassword)
router.put('/ai-consent', toggleAIConsent)
router.delete('/account', deleteAccount)

module.exports = router
