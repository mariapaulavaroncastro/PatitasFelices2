const express = require('express');
const router = express.Router();
const { registrarVoluntario } = require('../controladores/voluntariadoControlador');

// POST /voluntariado
router.post('/', registrarVoluntario);

module.exports = router;