const PushSubscription = require('../models/PushSubscription')
const webpush = require('web-push')

const { handleError } = require('../utils/errorHandler')
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || ''
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || ''

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:support@flowsync-ai.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  )
}

const subscribe = async (req, res) => {
  try {
    const { endpoint, keys } = req.body
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ message: 'Invalid subscription' })
    }

    await PushSubscription.findOneAndUpdate(
      { endpoint },
      { user: req.user._id, endpoint, keys },
      { upsert: true, new: true }
    )

    res.json({ message: 'Subscribed' })
  } catch (error) {
    handleError(res, error)
  }
}

const unsubscribe = async (req, res) => {
  try {
    const { endpoint } = req.body
    if (endpoint) {
      await PushSubscription.findOneAndDelete({ endpoint, user: req.user._id })
    } else {
      await PushSubscription.deleteMany({ user: req.user._id })
    }
    res.json({ message: 'Unsubscribed' })
  } catch (error) {
    handleError(res, error)
  }
}

async function sendPushToUser(userId, payload) {
  try {
    const subs = await PushSubscription.find({ user: userId })
    const results = await Promise.allSettled(
      subs.map(sub =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          JSON.stringify(payload)
        ).catch(async (err) => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            await PushSubscription.findOneAndDelete({ endpoint: sub.endpoint })
          }
        })
      )
    )
    return results
  } catch {
    return []
  }
}

module.exports = { subscribe, unsubscribe, sendPushToUser }
