const { Router } = require('express')
const { register, login } = require('../controllers/authController')
const { registerValidation, loginValidation } = require('../validators/authValidators')

const router = Router()

router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)

module.exports = router
