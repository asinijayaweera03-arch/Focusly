const express = require('express')
const { loginUser, signupUser, googleAuth } = require('../controller/userController')

const router = express.Router()

// POST login
router.post('/login', loginUser)

// POST signup
router.post('/signup', signupUser)

// POST google auth
router.post('/google', googleAuth)

module.exports = router
