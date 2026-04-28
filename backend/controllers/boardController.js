const Board = require('../models/Board');
const Task = require('../models/Task');

// GET /api/boards
const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/boards
const createBoard = async (req, res) => {
  try {
    const { title, description, color } = req.body;
    if (!title) return res.status(400).json({ message: 'El título es requerido' });

    const board = await Board.create({ title, description, color, owner: req.user._id });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/boards/:id
const getBoard = async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, owner: req.user._id });
    if (!board) return res.status(404).json({ message: 'Tablero no encontrado' });
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/boards/:id
const updateBoard = async (req, res) => {
  try {
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!board) return res.status(404).json({ message: 'Tablero no encontrado' });
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/boards/:id
const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!board) return res.status(404).json({ message: 'Tablero no encontrado' });
    await Task.deleteMany({ board: req.params.id });
    res.json({ message: 'Tablero eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getBoards, createBoard, getBoard, updateBoard, deleteBoard };
