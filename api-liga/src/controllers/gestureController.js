// Mock data - depois virá do PostgreSQL
const gestures = [
  { id: 1, word: 'bom dia', category: 'saudacao' },
  { id: 2, word: 'obrigado', category: 'educacao' },
  { id: 3, word: 'água', category: 'necessidades' }
];

const gestureController = {
  // Listar todos os gestos
  getAllGestures: (req, res) => {
    try {
      res.json({
        success: true,
        count: gestures.length,
        data: gestures
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar gestos',
        error: error.message
      });
    }
  },

  // Buscar gesto por ID
  getGestureById: (req, res) => {
    try {
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
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar gesto',
        error: error.message
      });
    }
  },

  // Health check
  healthCheck: (req, res) => {
    res.json({ 
      status: 'OK', 
      message: 'API LIGA está funcionando!',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  }
};

module.exports = gestureController;