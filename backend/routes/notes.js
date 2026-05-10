const express = require('express')
const {
  createNote,
  getNote,
  getNotes,
  deleteNote,
  updateNote,
  logFocusTime
} = require('../controller/noteController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all note routes
router.use(requireAuth)

// GET all Notes
router.get('/', getNotes)

// GET a single Note
router.get('/:id', getNote)

// POST a new Note
router.post('/', createNote)

// DELETE a Note
router.delete('/:id', deleteNote)

// PUT (update) a Note
router.put('/:id', updateNote)

//add the focus log route
router.patch('/:id/focus', logFocusTime)

module.exports = router