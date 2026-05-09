require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const noteRoutes = require('./routes/notes')
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


// start cron job
moveTomorrowTasks()

//connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    //listen for request
    app.listen(process.env.PORT, () => {
       console.log("connected to db & listening on port ",process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })



 