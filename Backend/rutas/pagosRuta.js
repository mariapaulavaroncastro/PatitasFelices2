const express = require('express');
const router = express.Router();
const { crearPreferencia, recibirWebhook } = require('../controladores/pagosControlador');

router.post('/crear-preferencia', crearPreferencia);
router.post('/webhook', recibirWebhook);

module.exports = router;