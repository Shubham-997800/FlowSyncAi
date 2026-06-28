const { Router } = require('express')
const { getProfile, updateProfile, updatePassword, deleteAccount } = require('../controllers/settingsController')
const { protect } = require('../middleware/auth')

const router = Router()
router.use(protect)

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.put('/password', updatePassword)
router.delete('/account', deleteAccount)

module.exports = router
