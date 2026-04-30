const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/boards');
const taskRoutes = require('./routes/tasks');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ message: err.message });
});

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Servidor corriendo en puerto ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error('❌ Error MongoDB:', err));