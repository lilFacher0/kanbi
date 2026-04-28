const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, required: true },
    priority: {
      type: String,
      enum: ['baja', 'media', 'alta'],
      default: 'media',
    },
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Number, default: 0 },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
