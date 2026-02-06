const User = require('../models/User')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')

const register = asyncWrapper(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ msg: 'Please provide name, email, and password' })
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ msg: 'Email already registered' })
  }

  const user = await User.create({ name, email, password })
  const token = user.createJWT()

  res.status(201).json({
    user: { name: user.name, email: user.email },
    token,
  })
})

const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password' })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({ msg: 'Invalid credentials' })
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    return res.status(401).json({ msg: 'Invalid credentials' })
  }

  const token = user.createJWT()

  res.status(200).json({
    user: { name: user.name, email: user.email },
    token,
  })
})

module.exports = { register, login }
