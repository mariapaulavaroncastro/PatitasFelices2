const express = require('express');
const { registrarDonacion } = require('../controladores/donacionesControlador');

const router = express.Router();

router.post('/', registrarDonacion);

module.exports = router;