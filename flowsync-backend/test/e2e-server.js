/* FlowSync AI — Playwright E2E backend boot
 * Boots the real Express app against an in-memory MongoDB so browser tests
 * can exercise the full stack. Spawned by Playwright's webServer config. */

process.env.MONGOMS_VERSION = '6.0.9'
process.env.JWT_SECRET = process.env.JWT_SECRET || 'qa-test-'.padEnd(64, 'x')
process.env.CLIENT_URL = 'http://localhost:5173'
process.env.OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''
process.env.NODE_ENV = 'test'
process.env.PORT = process.env.PORT || '5000'
process.env.RATE_LIMIT_AUTH = '1000'
process.env.RATE_LIMIT_AI = '1000'
process.env.RATE_LIMIT_GENERAL = '1000'
process.env.RATE_LIMIT_LOGIN = '1000'

const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const app = require('../app')

async function main() {
  const mongo = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongo.getUri()
  await mongoose.connect(mongo.getUri())
  console.log('E2E Mongo up')

  const port = Number(process.env.PORT)
  const server = app.listen(port, () => {
    console.log(`E2E API up on http://localhost:${port}`)
  })

  const shutdown = async () => {
    server.close()
    await mongoose.disconnect()
    await mongo.stop()
    process.exit(0)
  }
  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
}

main().catch((e) => {
  console.error('E2E SERVER FATAL:', e)
  process.exit(1)
})
