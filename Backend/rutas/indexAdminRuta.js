const express = require('express');
const router = express.Router();

// Este enrutador principal unifica todas las rutas de administración.

// Rutas de autenticación de admin (login)
router.use(require('./adminRuta'));

// Rutas para gestionar adopciones (/admin/adopciones)
router.use(require('./adopcionAdminRuta'));
router.use('/noticias', require('./noticiasAdminRuta'));

module.exports = router;