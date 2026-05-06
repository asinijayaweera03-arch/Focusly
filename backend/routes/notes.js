const express = require('express')
const {
    createNote,
    getNote,
    getNotes,
    deleteNote,
    updateNote
    
} = require('../controller/noteController')
const { updateMany } = require('../models/noteModel')

const router = express.Router()

// GET all Notes
router.get('/', getNotes)

// GET a single Note
router.get('/:id', getNote)

// POST a new Note
router.post('/', createNote)

// DELETE a Note
router.delete('/:id', deleteNote)

// Update a Note
router.patch('/:id', updateNote)


module.exports = router