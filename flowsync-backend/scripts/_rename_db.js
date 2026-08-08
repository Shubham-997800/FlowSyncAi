const dns = require('dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])
const mongoose = require('mongoose')
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

async function main() {
  const conn = await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 20000 })
  const client = conn.connection.getClient()
  console.log('Connected to db:', conn.connection.name)
  const admin = client.db().admin()
  const dbs = await admin.listDatabases()
  console.log('Databases before:', dbs.databases.map(d => d.name).join(', '))
  if (dbs.databases.some(d => d.name === 'test')) {
    await client.db('test').dropDatabase()
    console.log('Dropped: test')
  }
  const dbs2 = await admin.listDatabases()
  console.log('Databases after:', dbs2.databases.map(d => d.name).join(', '))
  await mongoose.disconnect()
}
main().catch(e => { console.error('ERR:', e.message); process.exit(1) })
