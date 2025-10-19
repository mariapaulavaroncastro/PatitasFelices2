const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Carga las variables de entorno

const pool = require('./base-datos/conexionSQL'); // Ahora se importa después de dotenv

const app = express();
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '..', 'Frontend', 'images'))); // Esta línea ya estaba correcta, pero la confirmo.
app.get('/', (req, res) => {
  // Redirige la raíz del backend al frontend
  res.redirect('http://127.0.0.1:5500/Frontend/index.html');
});

// Rutas de Pagos (Mercado Pago)
const pagosRuta = require('./rutas/pagosRuta');
app.use('/pagos', pagosRuta);

const donacionesRuta = require('./rutas/donacionesRuta');
app.use('/donaciones', donacionesRuta);

app.use('/adopciones', require('./rutas/adopcionesRuta'));

const voluntariadoRuta = require('./rutas/voluntariadoRuta');
app.use('/voluntariado', voluntariadoRuta);

app.use('/admin', require('./rutas/indexAdminRuta'));
app.use('/noticias', require('./rutas/noticiasAdminRuta')); // ✅ sirve también para el público


// Punto de entrada único para todas las rutas de administración

app.use('/admin/noticias', require('./rutas/noticiasAdminRuta')); // ✅ correcto

app.listen(3000, () => {
  console.log(' Servidor corriendo en http://localhost:3000');
});