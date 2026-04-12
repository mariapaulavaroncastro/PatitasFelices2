const express = require('express');
const router = express.Router();
const noticiasAdminCtrl = require('../controladores/noticiasAdminControlador');

// Esto te servirá para confirmar en la terminal que todo cargó bien al arrancar
console.log("Funciones detectadas:", Object.keys(noticiasAdminCtrl));

router.get('/', noticiasAdminCtrl.listarNoticias);
router.post('/', noticiasAdminCtrl.publicarNoticiaConImagen);
router.delete('/:id', noticiasAdminCtrl.eliminarNoticia);
router.put('/:id', noticiasAdminCtrl.actualizarNoticia); // Ahora sí funcionará

module.exports = router;