const express = require('express');
const router = express.Router();
const {
  obtenerNoticias,
  registrarReaccion,
  registrarComentario,
  obtenerComentarios,
  contarReacciones
} = require('../controladores/noticiasControlador');

// ✅ Estas rutas ya tienen el prefijo /noticias desde servidor.js
router.get('/', obtenerNoticias);
router.post('/:id/reaccionar', registrarReaccion);
router.post('/:id/comentar', registrarComentario);
router.get('/:id/comentarios', obtenerComentarios);
router.get('/:id/reacciones', contarReacciones);

module.exports = router;