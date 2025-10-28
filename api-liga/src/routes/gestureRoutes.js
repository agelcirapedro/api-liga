const express = require('express');
const router = express.Router();
const gestureController = require('../controllers/gestureController');

// Rotas de gestos
router.get('/gestures', gestureController.getAllGestures);
router.get('/gestures/:id', gestureController.getGestureById);

// Health check
router.get('/health', gestureController.healthCheck);

module.exports = router;