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