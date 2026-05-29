const NoteModel = require('../models/noteModel')
const mongoose = require('mongoose')

// get all notes
const getNotes = async (req, res) => {
  const user_id = req.user._id
  const notes = await NoteModel.find({ user_id }).sort({ createdAt: -1 })
  res.status(200).json(notes)
}

// get a single note
const getNote = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such note' })
  }

  const note = await NoteModel.findOne({ _id: id, user_id: req.user._id })

  if (!note) {
    return res.status(404).json({ error: 'No such note' })
  }

  res.status(200).json(note)
}

// create a new note
const createNote = async (req, res) => {
  const { title, noteType } = req.body

  let emptyFields = []

  if (!title) emptyFields.push('title')
  if (!noteType) emptyFields.push('noteType')

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  try {
    const user_id = req.user._id
    const note = await NoteModel.create({ ...req.body, user_id })
    res.status(201).json(note)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete a note
const deleteNote = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such note' })
  }

  const note = await NoteModel.findOneAndDelete({ _id: id, user_id: req.user._id })

  if (!note) {
    return res.status(404).json({ error: 'No such note' })
  }

  res.status(200).json(note)
}

// update a note
const updateNote = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such note' })
  }

  // ✅ Auto-set completedAt when marking complete/incomplete
  const updateData = { ...req.body }
  if (req.body.completed === true) {
    updateData.completedAt = new Date()
  } else if (req.body.completed === false) {
    updateData.completedAt = null
  }

  const note = await NoteModel.findOneAndUpdate(
    { _id: id, user_id: req.user._id },
    { ...updateData },
    { new: true }
  )

  if (!note) {
    return res.status(404).json({ error: 'No such note' })
  }

  res.status(200).json(note)
}

// log focus time for a note
const logFocusTime = async (req, res) => {
  const minutes = Number(req.body.minutes)
  if (!minutes || minutes <= 0) {
    return res.status(400).json({ error: 'minutes must be a positive number' })
  }

  try {
    const note = await NoteModel.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { $inc: { totalFocusedMinutes: minutes } },
      { new: true }
    )
    if (!note) return res.status(404).json({ error: 'No such note' })
    res.status(200).json(note)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { getNotes, getNote, createNote, deleteNote, updateNote, logFocusTime }