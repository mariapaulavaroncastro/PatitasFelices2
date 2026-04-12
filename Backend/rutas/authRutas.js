const express = require('express');
const router = express.Router();
const authControlador = require('../controladores/authControlador');

// Registro de usuarios (donantes/invitados que quieren cuenta)
router.post('/registrar', authControlador.registrar);

// Inicio de sesión tradicional (Email y Contraseña)
router.post('/login', authControlador.login);

// NUEVA: Inicio de sesión / Registro con Google 🐾
// Esta ruta es la que llamamos desde el 'fetch' en login.html
router.post('/google', authControlador.loginGoogle);

module.exports = router;