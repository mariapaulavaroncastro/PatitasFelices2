const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../Frontend/images'),
  filename: (req, file, cb) => {
    const nombreUnico = Date.now() + path.extname(file.originalname);
    cb(null, nombreUnico);
  }
});

// Exporta el middleware de multer
module.exports = multer({ storage });