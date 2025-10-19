const express = require('express');
const router = express.Router();
const { listarAdopcionesPublico, registrarSolicitud } = require('../controladores/adopcionesControlador');

// GET /adopciones - Para listar todos los animales
router.get('/', listarAdopcionesPublico);

// POST /adopciones/solicitud - Para enviar un formulario de solicitud
router.post('/solicitud', registrarSolicitud);

module.exports = router;