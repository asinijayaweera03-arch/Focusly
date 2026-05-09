const mongoose = require('mongoose')

const Schema = mongoose.Schema

const noteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  noteType: {
    type: String,
    enum: ['todo', 'study', 'weekly', 'tomorrow'],
    required: true,
    default: 'todo'
  },
  subject: {
    type: String,
    default: 'general'
  },
  duration: {
    type: Number,
    default: 0
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  user_id: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Note', noteSchema)
