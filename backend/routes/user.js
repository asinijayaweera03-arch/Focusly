const express = require('express')
const { loginUser, signupUser } = require('../controller/userController')

const router = express.Router()

// POST login
router.post('/login', loginUser)

// POST signup
router.post('/signup', signupUser)

module.exports = router
