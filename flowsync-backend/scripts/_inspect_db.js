const dns = require('dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])
const mongoose = require('mongoose')
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

async function main() {
  const conn = await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 20000 })
  const client = conn.connection.getClient()
  const admin = client.db().admin()
  const dbs = await admin.listDatabases()
  for (const d of dbs.databases) {
    if (d.name === 'admin' || d.name === 'local') continue
    const db = client.db(d.name)
    const collections = await db.listCollections().toArray()
    for (const c of collections) {
      const count = await db.collection(c.name).countDocuments({})
      console.log(d.name + '/' + c.name + ': ' + count)
    }
  }
  await mongoose.disconnect()
}
main().catch(e => { console.error('ERR:', e.message); process.exit(1) })
