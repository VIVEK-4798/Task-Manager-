const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'must provide name'],
      trim: true,
      maxlength: [100, 'name can not be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'description can not be more than 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Task', TaskSchema)
