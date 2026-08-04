const webpush = require('web-push')

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || ''
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || ''
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:support@flowsync-ai.com'

function isValidVapidKey(value) {
  if (typeof value !== 'string' || !value) return false
  return /^[A-Za-z0-9_-]{40,}$/.test(value)
}

function initPush() {
  const hasPublic = isValidVapidKey(VAPID_PUBLIC_KEY)
  const hasPrivate = isValidVapidKey(VAPID_PRIVATE_KEY)
  if (hasPublic !== hasPrivate) {
    console.warn('Push notifications disabled — both VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY must be set together.')
    return { enabled: false }
  }
  if (!hasPublic || !hasPrivate) {
    return { enabled: false }
  }
  try {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
    return { enabled: true }
  } catch (err) {
    console.warn('Push notifications disabled — invalid VAPID keys:', err.message)
    return { enabled: false }
  }
}

module.exports = { initPush, isValidVapidKey }
