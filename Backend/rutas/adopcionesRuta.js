const express = require('express');
const router = express.Router();
const controlador = require('../controladores/adopcionesControlador');

router.post('/adopcion', controlador.registrarSolicitud);

module.exports = router;