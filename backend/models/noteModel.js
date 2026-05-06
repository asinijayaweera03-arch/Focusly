const mongoose = require('mongoose')

const Schema = mongoose.Schema 

const noteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: 'general'
    },
    user_id: {
        type: String,
        required: false
    }
},{timestamps: true})

module.exports = mongoose.model('Note',noteSchema)

