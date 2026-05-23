const express = require('express')
const router = express.Router()
const PomodoroSession = require('../models/pomodoroSession')
const Note = require('../models/noteModel')
const requireAuth = require('../middleware/requireAuth') // your existing auth middleware

// Helper: last 7 days as YYYY-MM-DD strings
function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().slice(0, 10)
  })
}

// GET /api/stats/weekly  — focus minutes per day (last 7 days)
router.get('/weekly', requireAuth, async (req, res) => {
  const since = new Date()
  since.setDate(since.getDate() - 6)
  since.setHours(0, 0, 0, 0)

  const sessions = await PomodoroSession.aggregate([
    {
      $match: {
        user_id: req.user._id.toString(),
        createdAt: { $gte: since }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        minutes: { $sum: '$duration' }
      }
    },
    { $sort: { _id: 1 } }
  ])

  // Fill in missing days with 0
  const map = {}
  sessions.forEach(s => (map[s._id] = s.minutes))

  const result = getLast7Days().map(date => ({
    date,
    minutes: map[date] ?? 0
  }))

  res.json(result)
})

// GET /api/stats/tasks-per-day  — completed tasks per day (last 7 days)
router.get('/tasks-per-day', requireAuth, async (req, res) => {
  const since = new Date()
  since.setDate(since.getDate() - 6)
  since.setHours(0, 0, 0, 0)

  const tasks = await Note.aggregate([
    {
      $match: {
        user_id: req.user._id.toString(),
        completed: true,
        completedAt: { $gte: since }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ])

  const map = {}
  tasks.forEach(t => (map[t._id] = t.count))

  const result = getLast7Days().map(date => ({
    date,
    count: map[date] ?? 0
  }))

  res.json(result)
})

// POST /api/stats/session  — save a completed Pomodoro
router.post('/session', requireAuth, async (req, res) => {
  const { duration, subject, label } = req.body
  try {
    const session = await PomodoroSession.create({
      user_id: req.user._id.toString(),
      duration: duration || 25,
      subject: subject || 'general',
      label: label || ''
    })
    res.status(201).json(session)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router