const mongoose = require('mongoose')

const pomodoroSessionSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  duration: {
    type: Number,  // minutes — e.g. 25
    required: true
  },
  subject: {
    type: String,
    default: 'general'
  },
  label: {
    type: String,
    default: ''  // optional note title / task label
  }
}, { timestamps: true })  // gives us createdAt automatically

module.exports = mongoose.model('PomodoroSession', pomodoroSessionSchema)