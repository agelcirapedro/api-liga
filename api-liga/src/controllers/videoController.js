const Gesture = require('../models/Gesture');
const path = require('path');
const fs = require('fs');

const videoController = {
  // Upload de vídeo LOCAL para gesto específico
  uploadGestureVideo: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Nenhum arquivo de vídeo enviado'
        });
      }

      const { gestureId } = req.params;
      
      // Verificar se gesto existe
      const gesture = await Gesture.findById(gestureId);
      if (!gesture) {
        // Limpar arquivo temporário
        fs.unlinkSync(req.file.path);
        return res.status(404).json({
          success: false,
          message: 'Gesto não encontrado'
        });
      }

      // Gerar URL local para o vídeo
      const videoUrl = `/uploads/videos/${path.basename(req.file.path)}`;

      // Atualizar gesto com URL do vídeo
      await Gesture.updateVideoUrl(gestureId, videoUrl);

      res.json({
        success: true,
        message: 'Vídeo enviado com sucesso',
        data: {
          gestureId: parseInt(gestureId),
          videoUrl: videoUrl,
          fileName: req.file.filename,
          localPath: req.file.path
        }
      });

    } catch (error) {
      console.error('Erro no upload:', error);
      
      // Limpar arquivo temporário em caso de erro
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao fazer upload do vídeo',
        error: error.message
      });
    }
  },

  // Listar gestos com vídeos
  getGesturesWithVideos: async (req, res) => {
    try {
      const gestures = await Gesture.findWithVideos();
      
      res.json({
        success: true,
        count: gestures.length,
        data: gestures
      });
    } catch (error) {
      console.error('Erro ao buscar gestos com vídeos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar gestos com vídeos',
        error: error.message
      });
    }
  }
};

module.exports = videoController;