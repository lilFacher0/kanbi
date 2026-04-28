const Task = require('../models/Task');
const Board = require('../models/Board');

// GET /api/tasks?board=boardId
const getTasks = async (req, res) => {
  try {
    const { board } = req.query;
    const filter = { owner: req.user._id };
    if (board) filter.board = board;

    const tasks = await Task.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, board, dueDate } = req.body;
    if (!title || !board || !status)
      return res.status(400).json({ message: 'Título, tablero y estado son requeridos' });

    // Verificar que el tablero pertenece al usuario
    const boardExists = await Board.findOne({ _id: board, owner: req.user._id });
    if (!boardExists) return res.status(404).json({ message: 'Tablero no encontrado' });

    const task = await Task.create({
      title, description, status, priority, board, dueDate,
      owner: req.user._id,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
