const Gesture = require('../models/Gesture');
const { bucket } = require('../../config/firebase');
const path = require('path');
const fs = require('fs');

const videoController = {
  // Upload de vídeo para Firebase Storage
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

      // Definir caminho no Firebase Storage
      const fileName = `gestures/${gestureId}/video_${Date.now()}${path.extname(req.file.originalname)}`;
      
      // Upload para Firebase Storage
      await bucket.upload(req.file.path, {
        destination: fileName,
        metadata: {
          contentType: req.file.mimetype,
          metadata: {
            gestureId: gestureId,
            uploadedBy: req.user ? req.user.id : 'anonymous',
            uploadedAt: new Date().toISOString()
          }
        }
      });

      // Tornar arquivo público
      const file = bucket.file(fileName);
      await file.makePublic();

      // Gerar URL pública
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      // Atualizar gesto com URL do vídeo
      await Gesture.updateVideoUrl(gestureId, publicUrl);

      // Limpar arquivo temporário local
      fs.unlinkSync(req.file.path);

      res.json({
        success: true,
        message: 'Vídeo enviado com sucesso para Firebase Storage',
        data: {
          gestureId: parseInt(gestureId),
          videoUrl: publicUrl,
          fileName: fileName,
          storageProvider: 'firebase'
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
  },

  // Deletar vídeo do Firebase Storage
  deleteGestureVideo: async (req, res) => {
    try {
      const { gestureId } = req.params;

      // Verificar se gesto existe
      const gesture = await Gesture.findById(gestureId);
      if (!gesture) {
        return res.status(404).json({
          success: false,
          message: 'Gesto não encontrado'
        });
      }

      // Verificar se há vídeo
      if (!gesture.video_url) {
        return res.status(404).json({
          success: false,
          message: 'Gesto não possui vídeo'
        });
      }

      // Extrair nome do arquivo da URL do Firebase
      // URL: https://storage.googleapis.com/bucket-name/gestures/1/video_123.mp4
      const urlParts = gesture.video_url.split('/');
      const fileName = urlParts.slice(4).join('/'); // gestures/1/video_123.mp4

      // Deletar do Firebase Storage
      try {
        await bucket.file(fileName).delete();
      } catch (firebaseError) {
        console.warn('Arquivo não encontrado no Firebase:', firebaseError.message);
        // Continuar mesmo se arquivo não existir no Firebase
      }

      // Remover URL do banco de dados
      await Gesture.updateVideoUrl(gestureId, null);

      res.json({
        success: true,
        message: 'Vídeo removido com sucesso',
        data: {
          gestureId: parseInt(gestureId)
        }
      });

    } catch (error) {
      console.error('Erro ao deletar vídeo:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar vídeo',
        error: error.message
      });
    }
  }
};

module.exports = videoController;