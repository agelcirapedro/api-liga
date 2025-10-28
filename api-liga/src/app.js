const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const gestureRoutes = require('./routes/gestureRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/v1', gestureRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    name: 'API LIGA',
    version: '1.0.0',
    description: 'API para Língua Gestual Angolana',
    endpoints: {
      gestures: '/api/v1/gestures',
      health: '/api/v1/health'
    }
  });
});

// Rota 404 - não encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

app.listen(port, () => {
  console.log(`API LIGA rodando na porta ${port}`);
});

module.exports = app;