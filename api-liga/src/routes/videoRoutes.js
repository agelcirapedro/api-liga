const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const upload = require('../../config/upload');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/v1/gestures/{gestureId}/video:
 *   post:
 *     summary: Upload de vídeo para um gesto
 *     tags: [Vídeos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gestureId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do gesto
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de vídeo (max 50MB)
 *     responses:
 *       200:
 *         description: Vídeo enviado com sucesso
 *       400:
 *         description: Nenhum arquivo enviado ou formato inválido
 *       404:
 *         description: Gesto não encontrado
 */
router.post('/gestures/:gestureId/video', 
  authenticate,
  upload.single('video'),
  videoController.uploadGestureVideo
);

/**
 * @swagger
 * /api/v1/gestures/with-videos:
 *   get:
 *     summary: Listar gestos que possuem vídeos
 *     tags: [Vídeos]
 *     responses:
 *       200:
 *         description: Lista de gestos com vídeos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Gesture'
 */
router.get('/gestures/with-videos', 
  videoController.getGesturesWithVideos
);

/**
 * @swagger
 * /api/v1/gestures/{gestureId}/video:
 *   delete:
 *     summary: Deletar vídeo de um gesto
 *     tags: [Vídeos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gestureId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do gesto
 *     responses:
 *       200:
 *         description: Vídeo removido com sucesso
 *       404:
 *         description: Gesto não encontrado ou sem vídeo
 *       401:
 *         description: Não autenticado
 */
router.delete('/gestures/:gestureId/video',
  authenticate,
  videoController.deleteGestureVideo
);

module.exports = router;
