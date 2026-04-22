const express = require('express');
const router = express.Router();
const { registrarDonacion } = require('../controladores/donacionesControlador');

// Esta ruta responde a POST http://142.93.53.83/api/donaciones
router.post('/', registrarDonacion);

module.exports = router;