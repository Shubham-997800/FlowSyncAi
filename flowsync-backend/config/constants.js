module.exports = {
  AI_DAILY_LIMIT: Number(process.env.AI_DAILY_LIMIT) || 300,
  AI_MONTHLY_LIMIT: Number(process.env.AI_MONTHLY_LIMIT) || 3000,
  MAX_CHAT_SESSIONS: Number(process.env.MAX_CHAT_SESSIONS) || 6,
  REMINDER_CHECK_INTERVAL: Number(process.env.REMINDER_CHECK_INTERVAL) || 30 * 60 * 1000,
}
