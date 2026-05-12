require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const noteRoutes = require('./routes/notes')
const userRoutes = require('./routes/user')
const moveTomorrowTasks = require('./cron/moveTasks')
const cors = require('cors')


//express app
const app = express()



/*app.use(cors({
  origin: 'https://practice-project-pi-ten.vercel.app',
  credentials: true
}))*/

// app.use(cors())
app.use(cors())

// middleware
app.use(express.json())
app.use((req, res, next)=>{
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/notes', noteRoutes)
app.use('/api/user', userRoutes)


// start cron job
moveTomorrowTasks()

/* catch-up: move any tasks missed while server was off
const Note = require('./models/noteModel')
const runCatchUp = async () => {
  const todayAt4am = new Date()
  todayAt4am.setHours(4, 0, 0, 0)
  if (new Date() > todayAt4am) {
    await Note.updateMany(
      { noteType: 'tomorrow', createdAt: { $lt: todayAt4am } },
      { $set: { noteType: 'todo', completed: false, completedAt: null } }
    )
    console.log('✅ Catch-up: moved missed tomorrow tasks')
  }
}
*/

const runCatchUp = async () => {
  console.log('🔍 Running catch-up...')
  const all = await Note.find({ noteType: 'tomorrow' })
  console.log('Found tomorrow tasks:', all.length)
  const result = await Note.updateMany(
    { noteType: 'tomorrow' },
    { $set: { noteType: 'todo', completed: false, completedAt: null } }
  )
  console.log('Modified:', result.modifiedCount)
}


//connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    //listen for request
    app.listen(process.env.PORT, () => {
       console.log("connected to db & listening on port ",process.env.PORT)
    })
     runCatchUp()
  })
 
  .catch((error) => {
    console.log(error)
  })



 