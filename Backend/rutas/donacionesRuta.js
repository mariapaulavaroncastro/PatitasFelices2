const express = require('express');
const router = express.Router();
const { registrarDonacion } = require('../controladores/donacionesControlador');

// Esta ruta responde a POST http://localhost:3000/donaciones
router.post('/', registrarDonacion);

module.exports = router;