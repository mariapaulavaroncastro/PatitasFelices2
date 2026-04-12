const express = require('express');
const router = express.Router();

// 1. Importamos el controlador que tiene la nueva lógica y seguridad
const loginController = require('../controladores/loginAdmin');

// 2. Creamos la ruta POST que recibe los datos del Frontend y los manda al Controlador
router.post('/login', loginController.login);



module.exports = router;