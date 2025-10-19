const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'Frontend', 'images')); // ✅ Carpeta correcta
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // ✅ guarda el nombre original sin timestamp
  }
});

// Exporta el middleware de multer
module.exports = multer({ storage });