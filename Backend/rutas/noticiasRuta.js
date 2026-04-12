const express = require('express');
const router = express.Router();
const noticiasAdminCtrl = require('../controladores/noticiasAdminControlador');

// Verificamos qué está llegando (opcional, para depurar)
console.log("Funciones cargadas en el router:", Object.keys(noticiasAdminCtrl));

// Rutas
router.get('/', noticiasAdminCtrl.listarNoticias);
router.post('/', noticiasAdminCtrl.publicarNoticiaConImagen);
router.delete('/:id', noticiasAdminCtrl.eliminarNoticia);

// LÍNEA 13: Aquí es donde fallaba. 
// Asegúrate de que el nombre noticiasAdminCtrl.actualizarNoticia exista en el controlador.
router.put('/:id', noticiasAdminCtrl.actualizarNoticia);

module.exports = router;