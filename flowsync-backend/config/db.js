const dns = require('dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])
const mongoose = require('mongoose')

let cached = null

const connectDB = async () => {
  if (cached && mongoose.connection.readyState >= 1) return cached
  if (mongoose.connection.readyState >= 1) {
    cached = mongoose.connection
    return cached
  }
  try {
    cached = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB connected: ${cached.connection.host}`)
    return cached
  } catch (error) {
    cached = null
    console.error(`MongoDB error: ${error.message}`)
    throw error
  }
}

module.exports = connectDB
