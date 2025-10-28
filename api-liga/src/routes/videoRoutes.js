const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const upload = require('../../config/upload');

// Upload de vídeo para gesto
router.post('/gestures/:gestureId/video', 
  upload.single('video'),
  videoController.uploadGestureVideo
);

// Listar gestos com vídeos
router.get('/gestures/with-videos', 
  videoController.getGesturesWithVideos
);

module.exports = router;
