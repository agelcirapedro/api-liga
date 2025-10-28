const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Mock data para testes
const gestures = [
  { id: 1, word: 'bom dia', category: 'saudacao' },
  { id: 2, word: 'obrigado', category: 'educacao' }
];

// Endpoint de gestos
app.get('/api/v1/gestures', (req, res) => {
  res.json({
    success: true,
    count: gestures.length,
    data: gestures
  });
});

app.listen(port, () => {
  console.log(`Servidor a correr na porta ${port}`);
});

module.exports = app;

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API LIGA está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Buscar gesto por ID
app.get('/api/v1/gestures/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const gesture = gestures.find(g => g.id === id);
  
  if (!gesture) {
    return res.status(404).json({
      success: false,
      message: 'Gesto não encontrado'
    });
  }
  
  res.json({
    success: true,
    data: gesture
  });
});