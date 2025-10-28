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

  // Criar novo gesto
  createGesture: async (req, res) => {
    try {
      const { word, category, description } = req.body;
      
      // Validação básica
      if (!word || !category) {
        return res.status(400).json({
          success: false,
          message: 'Campos obrigatórios: word, category'
        });
      }

      const gesture = await Gesture.create({
        word,
        category,
        description
      });

      res.status(201).json({
        success: true,
        message: 'Gesto criado com sucesso',
        data: gesture
      });
    } catch (error) {
      console.error('Erro ao criar gesto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar gesto',
        error: error.message
      });
    }
  },

  // Atualizar gesto
  updateGesture: async (req, res) => {
    try {
      const { id } = req.params;
      const { word, category, description } = req.body;

      // Verificar se gesto existe
      const existingGesture = await Gesture.findById(id);
      if (!existingGesture) {
        return res.status(404).json({
          success: false,
          message: 'Gesto não encontrado'
        });
      }

      const gesture = await Gesture.update(id, {
        word: word || existingGesture.word,
        category: category || existingGesture.category,
        description: description !== undefined ? description : existingGesture.description
      });

      res.json({
        success: true,
        message: 'Gesto atualizado com sucesso',
        data: gesture
      });
    } catch (error) {
      console.error('Erro ao atualizar gesto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar gesto',
        error: error.message
      });
    }
  },

  // Remover gesto
  deleteGesture: async (req, res) => {
    try {
      const { id } = req.params;

      // Verificar se gesto existe
      const existingGesture = await Gesture.findById(id);
      if (!existingGesture) {
        return res.status(404).json({
          success: false,
          message: 'Gesto não encontrado'
        });
      }

      const deletedGesture = await Gesture.delete(id);

      res.json({
        success: true,
        message: 'Gesto removido com sucesso',
        data: deletedGesture
      });
    } catch (error) {
      console.error('Erro ao remover gesto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao remover gesto',
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