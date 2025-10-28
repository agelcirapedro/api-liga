const Gesture = require('../models/Gesture');

const gestureController = {
  // Listar todos os gestos (agora do PostgreSQL)
  getAllGestures: async (req, res) => {
    try {
      const gestures = await Gesture.findAll();
      
      res.json({
        success: true,
        count: gestures.length,
        data: gestures
      });
    } catch (error) {
      console.error('Erro no controller:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar gestos',
        error: error.message
      });
    }
  },

  // Buscar gesto por ID (agora do PostgreSQL)
  getGestureById: async (req, res) => {
    try {
      const { id } = req.params;
      const gesture = await Gesture.findById(id);
      
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
      console.error('Erro no controller:', error);
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
      version: '1.0.0',
      database: 'PostgreSQL conectado'
    });
  }
};

module.exports = gestureController;