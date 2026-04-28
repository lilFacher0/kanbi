const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    color: { type: String, default: '#6366f1' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    columns: {
      type: [String],
      default: ['Por hacer', 'En progreso', 'Hecho'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Board', boardSchema);
