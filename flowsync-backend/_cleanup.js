const mongoose = require('mongoose')
const uri = 'mongodb://shubhamkumar997800_db_user:Tdfq4cqDzPYTYLUF@ac-omfjkex-shard-00-00.wfh0ons.mongodb.net:27017,ac-omfjkex-shard-00-01.wfh0ons.mongodb.net:27017,ac-omfjkex-shard-00-02.wfh0ons.mongodb.net:27017/flowsync?ssl=true&replicaSet=atlas-omfjkex-shard-0&authSource=admin&retryWrites=true'

async function clean() {
  await mongoose.connect(uri)
  const db = mongoose.connection.db
  const users = await db.collection('users').find({ email: { $ne: 'shubhamdangi82@gmail.com' } }).toArray()
  console.log('Old users to delete:', users.length)
  for (const u of users) {
    console.log('  Deleting:', u.email, u._id.toString())
    const t = await db.collection('tasks').deleteMany({ user: u._id })
    const g = await db.collection('goals').deleteMany({ user: u._id })
    const h = await db.collection('habits').deleteMany({ user: u._id })
    const n = await db.collection('notifications').deleteMany({ user: u._id })
    console.log('    tasks:', t.deletedCount, 'goals:', g.deletedCount, 'habits:', h.deletedCount, 'notifications:', n.deletedCount)
    await db.collection('users').deleteOne({ _id: u._id })
  }
  const tasks = await db.collection('tasks').countDocuments()
  const goals = await db.collection('goals').countDocuments()
  const habits = await db.collection('habits').countDocuments()
  console.log('\nFinal: tasks=' + tasks + ' goals=' + goals + ' habits=' + habits)
  await mongoose.disconnect()
}
clean().catch(e => { console.error(e); process.exit(1) })
