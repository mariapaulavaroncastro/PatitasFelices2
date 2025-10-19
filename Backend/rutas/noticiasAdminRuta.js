const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
  publicarNoticiaConImagen,
  listarNoticias,
  eliminarNoticia,
  actualizarNoticia
} = require('../controladores/noticiasAdminControlador');

router.get('/', listarNoticias);
router.post('/', upload.single('imagen'), publicarNoticiaConImagen);
router.put('/:id', upload.single('imagen'), actualizarNoticia);
router.delete('/:id', eliminarNoticia);


module.exports = router;