const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
  crearAdopcionConImagen,
  listarAdopciones,
  eliminarAdopcion,
  actualizarAdopcion
} = require('../controladores/adopcionAdminControlador');

router.post('/admin/adopciones', upload.single('imagen'), crearAdopcionConImagen);
router.get('/admin/adopciones', listarAdopciones);
router.delete('/admin/adopciones/:id', eliminarAdopcion);
router.put('/admin/adopciones/:id', upload.single('imagen'), actualizarAdopcion);

module.exports = router;