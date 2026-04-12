const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); 

const pool = require('./base-datos/conexionSQL'); 

const app = express();
app.use(cors());
app.use(express.json());

// Servir imágenes estáticas
app.use('/images', express.static(path.join(__dirname, '..', 'Frontend', 'images')));

app.get('/', (req, res) => {
  res.redirect('http://127.0.0.1:5500/Frontend/index.html');
});

// --- SISTEMA DE AUTENTICACIÓN ---
const authRutas = require('./rutas/authRutas'); 
// Aquí Daniel debe tener: 
// router.post('/login', authControlador.login);
// router.post('/registrar', authControlador.registrar);
// router.post('/google', authControlador.loginGoogle); <--- ¡ESTA ES LA NUEVA!
app.use('/api/auth', authRutas); 

// --- RUTAS DEL PROYECTO ---
app.use('/pagos', require('./rutas/pagosRuta'));
app.use('/donaciones', require('./rutas/donacionesRuta'));
app.use('/adopciones', require('./rutas/adopcionesRuta'));
app.use('/voluntariado', require('./rutas/voluntariadoRuta'));

// --- RUTAS ADMINISTRATIVAS ---
// Agrupamos las de admin para que el código esté limpio
const adminRutas = require('./rutas/indexAdminRuta');
const adopcionAdmin = require('./rutas/adopcionAdminRuta');
const noticiasAdmin = require('./rutas/noticiasAdminRuta');

app.use('/admin', adminRutas);
app.use('/admin/adopciones', adopcionAdmin);
app.use('/admin/noticias', noticiasAdmin);
app.use('/noticias', noticiasAdmin); // Ruta pública para ver noticias

// --- SEGURIDAD Y CREACIÓN DE ADMIN ---
const bcrypt = require('bcryptjs');

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
        // Usamos Rol 1 para Admin General
        const valores = [1, 'Administrador General', 'admin@patitas.com', passwordHash, 'activo'];

        await pool.query(querySQL, valores);
        res.send('✅ ¡Administrador verificado/creado! Email: admin@patitas.com | Pass: admin123');
    } catch (error) {
        console.error(error);
        res.status(500).send('❌ Error al crear admin: ' + error.message);
    }
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({ mensaje: "Ruta no encontrada" });
});

app.listen(3000, () => {
  console.log('----------------------------------------------------');
  console.log('🚀 Servidor Patitas Felices: http://localhost:3000');
  console.log('🛡️  Seguridad: JWT y Google Auth activos');
  console.log('📊 Auditoría: Logs activados en Base de Datos');
  console.log('----------------------------------------------------');
});