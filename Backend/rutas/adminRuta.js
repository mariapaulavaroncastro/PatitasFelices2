const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controladores/adminControlador');

router.post('/admin/login', loginAdmin);

module.exports = router;