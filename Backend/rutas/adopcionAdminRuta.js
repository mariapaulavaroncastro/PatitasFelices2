const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
  crearAdopcionConImagen,
  listarAdopciones,
  eliminarAdopcion,
  actualizarAdopcion
} = require('../controladores/adopcionAdminControlador');

router.post('/adopciones', upload.single('imagen'), crearAdopcionConImagen);
router.get('/adopciones', listarAdopciones);
router.delete('/adopciones/:id', eliminarAdopcion);
router.put('/adopciones/:id', upload.single('imagen'), actualizarAdopcion);

module.exports = router;