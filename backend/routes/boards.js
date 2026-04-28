const express = require('express');
const router = express.Router();
const { getBoards, createBoard, getBoard, updateBoard, deleteBoard } = require('../controllers/boardController');
const { protect } = require('../middleware/auth');

router.use(protect); // Todas las rutas requieren autenticación

router.route('/').get(getBoards).post(createBoard);
router.route('/:id').get(getBoard).put(updateBoard).delete(deleteBoard);

module.exports = router;
