require('dotenv').config({ path: __dirname + '/.env' })

const express = require('express')
const mongoose = require('mongoose')
const noteRoutes = require('./routes/notes')
const userRoutes = require('./routes/user')
const moveTomorrowTasks = require('./cron/moveTasks')
const Note = require('./models/noteModel')
const statsRoutes = require('./routes/stats')  
const cors = require('cors')
const aiTestRoutes = require('./routes/aiTest');
const aiChatRoutes = require('./routes/aiChat');


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
app.use('/api/stats', statsRoutes)
app.use('/api/gamification', require('./routes/gamification'))
app.use('/api/ai', aiTestRoutes);
app.use('/api/ai', aiChatRoutes)



// start cron job
moveTomorrowTasks()

const runCatchUp = async () => {
  const todayAt4am = new Date()
  todayAt4am.setHours(4, 0, 0, 0)
  
  if (new Date() > todayAt4am) {
    console.log('🔍 Running catch-up...')
    const result = await Note.updateMany(
      { noteType: 'tomorrow', createdAt: { $lt: todayAt4am } },
      { $set: { noteType: 'todo', completed: false, completedAt: null } }
    )
    if (result.modifiedCount > 0) {
      console.log('✅ Catch-up: moved', result.modifiedCount, 'missed tomorrow tasks to todo')
    }
  }
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



 