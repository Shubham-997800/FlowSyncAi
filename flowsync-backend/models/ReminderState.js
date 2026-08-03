const mongoose = require('mongoose')

const reminderStateSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    lastRun: { type: Date, default: null },
  },
  { timestamps: false }
)

module.exports = mongoose.model('ReminderState', reminderStateSchema)
