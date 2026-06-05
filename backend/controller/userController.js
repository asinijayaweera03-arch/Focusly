const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.login(email, password)
    const token = createToken(user._id)
    res.status(200).json({
      email,
      token,
      xp: user.xp || 0,
      level: user.level || 1,
      streakCurrent: user.streakCurrent || 0,
      badges: user.badges || []
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// signup a user
const signupUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.signup(email, password)
    const token = createToken(user._id)
    res.status(200).json({
      email,
      token,
      xp: user.xp || 0,
      level: user.level || 1,
      streakCurrent: user.streakCurrent || 0,
      badges: user.badges || []
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { loginUser, signupUser }
