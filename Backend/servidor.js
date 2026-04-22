const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit'); // 1. Importar el limitador
require('dotenv').config(); 

const pool = require('./base-datos/conexionSQL'); 
const app = express();

// --- CAPA DE SEGURIDAD INICIAL ---
app.use(helmet()); 

// --- CONFIGURACIÓN DE LIMITADOR (Protección contra fuerza bruta) ---
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Tiempo de espera: 15 minutos
    max: 5, // Máximo 5 intentos por IP
    message: {
        mensaje: " Demasiados intentos fallidos. Por seguridad, tu IP ha sido bloqueada por 15 minutos."
    },
    standardHeaders: true, 
    legacyHeaders: false,
});

app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'] 
}));

app.use(express.json());

// Servir imágenes estáticas
app.use('/images', express.static(path.join(__dirname, '..', 'Frontend', 'images')));

// --- RUTAS ---

app.get('/', (req, res) => {
  res.redirect('http://127.0.0.1:5500/Frontend/index.html');
});

// Autenticación - AQUÍ APLICAMOS EL LIMITADOR
const authRutas = require('./rutas/authRutas'); 
// El limitador solo actúa en las rutas de login y registro
app.use('/api/auth', loginLimiter, authRutas); 

// --- RESTO DE LAS RUTAS ---
app.use('/pagos', require('./rutas/pagosRuta'));
app.use('/donaciones', require('./rutas/donacionesRuta'));
app.use('/adopciones', require('./rutas/adopcionesRuta'));
app.use('/voluntariado', require('./rutas/voluntariadoRuta'));

// Rutas Administrativas
app.use('/admin', require('./rutas/indexAdminRuta'));
app.use('/admin/adopciones', require('./rutas/adopcionAdminRuta'));
app.use('/admin/noticias', require('./rutas/noticiasAdminRuta'));
app.use('/noticias', require('./rutas/noticiasAdminRuta')); 

// --- UTILIDADES SEGURAS ---
app.get('/crear-admin', async (req, res) => {
    try {
        const passwordPlana = 'admin123';
        const salt = await bcrypt.getSalt(10);
        const passwordHash = await bcrypt.hash(passwordPlana, salt);

        const querySQL = `
            INSERT INTO usuarios (rol_id, nombre, email, password_hash, estado) 
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (email) DO NOTHING;
        `;
        const valores = [1, 'Administrador General', 'admin@patitas.com', passwordHash, 'activo'];

        await pool.query(querySQL, valores);
        res.send(' Administrador verificado.');
    } catch (error) {
        res.status(500).send(' Error: ' + error.message);
    }
});

app.use((req, res) => {
    res.status(404).json({ mensaje: "Ruta no encontrada" });
});

app.listen(3000, () => {
  console.log('----------------------------------------------------');
  console.log(' Servidor Patitas Felices en el puerto 3000');
  console.log('  Helmet, CORS y Rate Limit (5 intentos) ACTIVOS');
  console.log('----------------------------------------------------');
});