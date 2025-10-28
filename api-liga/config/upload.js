const multer = require('multer');
const path = require('path');

// Configurar storage para vídeos LOCAL
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'gesture-' + req.params.gestureId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtrar apenas vídeos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de vídeo são permitidos!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limite
  }
});

module.exports = upload;