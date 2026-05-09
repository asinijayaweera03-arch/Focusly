const cron = require('node-cron')
const Note = require('../models/noteModel')

const moveTomorrowTasks = () => {
  // Runs every day at 4:00 AM
  cron.schedule('0 4 * * *', async () => {
    try {
      console.log('⏰ 4am cron running — moving tomorrow tasks to To-Do...')

      const todayAt4am = new Date()
      todayAt4am.setHours(4, 0, 0, 0)

      const result = await Note.updateMany(
        {
          noteType: 'tomorrow',
          createdAt: { $lt: todayAt4am }
        },
        {
          $set: {
            noteType: 'todo',
            completed: false,
            completedAt: null
          }
        }
      )

      console.log(`✅ Moved ${result.modifiedCount} tasks from Tomorrow → To-Do`)
    } catch (err) {
      console.error('❌ Cron job failed:', err.message)
    }
  })
}

module.exports = moveTomorrowTasks