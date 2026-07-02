const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: {
    type: String, default: '',
    validate: {
      validator: function (v) {
        if (!v && !this.isNew) return true
        if (!v) return false
        return v.length >= 8 && /[A-Z]/.test(v) && /[0-9]/.test(v)
      },
      message: 'Password must be at least 8 characters with an uppercase letter and a number',
    },
  },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  jobTitle: { type: String, default: '' },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  isVerified: { type: Boolean, default: false },
  verificationOTP: String,
  verificationOTPExpire: Date,
  aiConsent: { type: Boolean, default: false },
  achievements: [{ name: String, unlockedAt: Date }],
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
}, { timestamps: true })

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.virtual('isLocked').get(function () {
  return this.lockUntil && this.lockUntil > Date.now()
})

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

userSchema.methods.incrementLoginAttempts = async function () {
  this.loginAttempts += 1
  if (this.loginAttempts >= 5) {
    this.lockUntil = new Date(Date.now() + 15 * 60 * 1000)
  }
  await this.save()
}

userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0
  this.lockUntil = null
  await this.save()
}

userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

module.exports = mongoose.model('User', userSchema)
