const express = require('express');
const router = express.Router();
const gestureController = require('../controllers/gestureController');
const { authenticate, isAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /api/v1/gestures:
 *   get:
 *     summary: Listar todos os gestos
 *     tags: [Gestos]
 *     responses:
 *       200:
 *         description: Lista de gestos retornada com sucesso
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
router.get('/gestures', gestureController.getAllGestures);

/**
 * @swagger
 * /api/v1/gestures/{id}:
 *   get:
 *     summary: Buscar gesto por ID
 *     tags: [Gestos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do gesto
 *     responses:
 *       200:
 *         description: Gesto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Gesture'
 *       404:
 *         description: Gesto não encontrado
 */
router.get('/gestures/:id', gestureController.getGestureById);

/**
 * @swagger
 * /api/v1/gestures:
 *   post:
 *     summary: Criar novo gesto
 *     tags: [Gestos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - word
 *               - category
 *             properties:
 *               word:
 *                 type: string
 *                 example: "olá"
 *               category:
 *                 type: string
 *                 example: "saudacao"
 *               description:
 *                 type: string
 *                 example: "Cumprimento informal"
 *     responses:
 *       201:
 *         description: Gesto criado com sucesso
 *       400:
 *         description: Campos obrigatórios faltando
 */
router.post('/gestures', authenticate, gestureController.createGesture);

/**
 * @swagger
 * /api/v1/gestures/{id}:
 *   put:
 *     summary: Atualizar gesto
 *     tags: [Gestos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do gesto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               word:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gesto atualizado com sucesso
 *       404:
 *         description: Gesto não encontrado
 */
router.put('/gestures/:id', authenticate, gestureController.updateGesture);

/**
 * @swagger
 * /api/v1/gestures/{id}:
 *   delete:
 *     summary: Remover gesto
 *     tags: [Gestos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do gesto
 *     responses:
 *       200:
 *         description: Gesto removido com sucesso
 *       404:
 *         description: Gesto não encontrado
 */
router.delete('/gestures/:id', authenticate, isAdmin, gestureController.deleteGesture);

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Verificar status da API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API funcionando normalmente
 */
router.get('/health', gestureController.healthCheck);

module.exports = router;