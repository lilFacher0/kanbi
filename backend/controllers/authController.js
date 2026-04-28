const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Todos los campos son requeridos' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'El email ya está registrado' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email y contraseña requeridos' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Credenciales incorrectas' });

    const token = generateToken(user._id);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, getMe };
