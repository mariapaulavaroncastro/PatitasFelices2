const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
  publicarNoticiaConImagen,
  listarNoticias,
  eliminarNoticia,
  actualizarNoticia
} = require('../controladores/noticiasAdminControlador');

router.post('/admin/noticias', upload.single('imagen'), publicarNoticiaConImagen);
router.get('/admin/noticias', listarNoticias);
router.delete('/admin/noticias/:id', eliminarNoticia);
router.put('/admin/noticias/:id', upload.single('imagen'), actualizarNoticia);

module.exports = router;