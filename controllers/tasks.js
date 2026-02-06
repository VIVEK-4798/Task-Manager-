const Task = require('../models/Task')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')

const getAllTasks = asyncWrapper(async (req, res) => {
  const queryObject = { createdBy: req.user.userId }

  // Filter by status
  const { status, search, sort } = req.query
  if (status && status !== 'all') {
    queryObject.status = status
  }

  // Search by name (case-insensitive)
  if (search) {
    queryObject.name = { $regex: search, $options: 'i' }
  }

  // Sort options
  let sortOption = { createdAt: -1 }
  if (sort === 'dueDate') {
    sortOption = { dueDate: 1, createdAt: -1 }
  }

  const tasks = await Task.find(queryObject).sort(sortOption)
  res.status(200).json({ tasks })
})

const createTask = asyncWrapper(async (req, res) => {
  req.body.createdBy = req.user.userId
  const task = await Task.create(req.body)
  res.status(201).json({ task })
})

const getTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params
  const task = await Task.findOne({ _id: taskID, createdBy: req.user.userId })
  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404))
  }

  res.status(200).json({ task })
})

const deleteTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params
  const task = await Task.findOneAndDelete({
    _id: taskID,
    createdBy: req.user.userId,
  })
  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404))
  }
  res.status(200).json({ task })
})

const updateTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params

  const task = await Task.findOneAndUpdate(
    { _id: taskID, createdBy: req.user.userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )

  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404))
  }

  res.status(200).json({ task })
})

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
}
