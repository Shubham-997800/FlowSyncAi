// express-rate-limit v7+ custom store backed by MongoDB (serverless-safe).
// Falls back to an in-memory Map if MongoDB is not connected so requests never
// fail just because the store is unavailable.

class MongoRateLimitStore {
  constructor({ prefix = 'rl:' } = {}) {
    this.prefix = prefix
    this.memory = new Map()
    this.windowMs = 60 * 1000
    this.col = null
    // Each limiter owns its own store instance, so hit tracking is per-instance.
    this.localKeys = true
  }

  init(options) {
    if (options && options.windowMs) this.windowMs = options.windowMs
  }

  keyOf(key) {
    return `${this.prefix}${key}`
  }

  async ensure() {
    if (this.col) return true
    const mongoose = require('mongoose')
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      this.col = mongoose.connection.db.collection('ratelimits')
      await this.col
        .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
        .catch(() => {})
      return true
    }
    return false
  }

  memoryIncrement(key) {
    const now = Date.now()
    let rec = this.memory.get(key)
    if (!rec || rec.resetAt <= now) {
      rec = { hits: 0, resetAt: now + this.windowMs }
      this.memory.set(key, rec)
    }
    rec.hits += 1
    return { totalHits: rec.hits, resetTime: new Date(rec.resetAt) }
  }

  async increment(key) {
    key = this.keyOf(key)
    if (!(await this.ensure())) return this.memoryIncrement(key)
    try {
      const now = Date.now()
      const resetAt = now + this.windowMs
      const record = await this.col.findOne({ key })
      let hits = 1
      let effectiveResetAt = resetAt
      if (record && record.resetAt > now) {
        hits = record.hits + 1
        effectiveResetAt = record.resetAt
      }
      await this.col.updateOne(
        { key },
        { $set: { key, hits, resetAt: effectiveResetAt, expiresAt: new Date(effectiveResetAt) } },
        { upsert: true }
      )
      return { totalHits: hits, resetTime: new Date(effectiveResetAt) }
    } catch {
      return this.memoryIncrement(key)
    }
  }

  async decrement(key) {
    key = this.keyOf(key)
    if (!(await this.ensure())) return
    try {
      const record = await this.col.findOne({ key })
      if (record && record.hits > 1) {
        await this.col.updateOne({ key }, { $set: { hits: record.hits - 1 } })
      }
    } catch {
      const rec = this.memory.get(key)
      if (rec && rec.hits > 0) rec.hits -= 1
    }
  }

  async resetKey(key) {
    key = this.keyOf(key)
    if (await this.ensure()) {
      try { await this.col.deleteOne({ key }) } catch {}
    }
    this.memory.delete(key)
  }

  async resetAll() {
    if (await this.ensure()) {
      try { await this.col.deleteMany({}) } catch {}
    }
    this.memory.clear()
  }
}

function createRateLimitStore(options) {
  return new MongoRateLimitStore(options)
}

module.exports = { createRateLimitStore }
