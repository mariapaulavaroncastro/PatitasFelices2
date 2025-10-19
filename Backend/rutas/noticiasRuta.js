const express = require('express');
const router = express.Router();

const {
  listarNoticias,
  registrarReaccion,
  registrarComentario,
  contarReacciones,
  obtenerComentariosPorNoticia,
} = require('../controladores/noticiasControlador');

// ✅ Estas rutas ya tienen el prefijo /noticias desde servidor.js
router.get('/', listarNoticias);
router.post('/:id/reaccionar', registrarReaccion);
router.post('/:id/comentar', registrarComentario);
router.get('/:id/comentarios', obtenerComentariosPorNoticia);
router.get('/:id/reacciones', contarReacciones);

module.exports = router;