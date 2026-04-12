const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../base-datos/conexionSQL');
const { OAuth2Client } = require('google-auth-library');

// Inicializamos el cliente de Google con el ID que obtuvieron
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Función de Auditoría: Registra acciones en la tabla logs_auditoria
 * Basado en la estructura de Supabase enviada
 */
const auditoria = async (id, accion, ip, agent, detalles) => {
    try {
        await pool.query(
            `INSERT INTO logs_auditoria (usuario_identificador, accion, ip_origen, user_agent, detalles) 
             VALUES ($1, $2, $3, $4, $5)`,
            [id, accion, ip, agent, JSON.stringify(detalles)]
        );
    } catch (err) {
        console.error("Error grabando auditoría:", err);
    }
};

/**
 * Registro Tradicional
 */
const registrar = async (req, res) => {
    const { nombre, email, contrasena, telefono } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const agent = req.headers['user-agent'];

    try {
        if (!contrasena) {
            return res.status(400).json({ error: "La contraseña es obligatoria" });
        }

        const salt = await bcrypt.genSalt(10);
        const passHash = await bcrypt.hash(contrasena, salt);

        // Insertamos con rol_id 4 (Usuario) según la tabla de roles
        await pool.query(
            'INSERT INTO usuarios (rol_id, nombre, email, password_hash, estado) VALUES ($1, $2, $3, $4, $5)',
            [4, nombre, email, passHash, 'activo']
        );

        await auditoria(email, 'REGISTRO_NUEVO_USUARIO', ip, agent, { nombre, telefono });
        res.status(201).json({ mensaje: "Registro exitoso" });
    } catch (error) {
        console.error("ERROR EN REGISTRO:", error.message);
        res.status(500).json({ error: "Error interno: " + error.message });
    }
};

/**
 * Login Tradicional
 */
const login = async (req, res) => {
    const { email, contrasena } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const agent = req.headers['user-agent'];

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const usuario = result.rows[0];

        if (!usuario) {
            return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
        }

        const coinciden = await bcrypt.compare(contrasena, usuario.password_hash);

        if (!coinciden) {
            await auditoria(email, 'LOGIN_FALLIDO', ip, agent, { motivo: 'Credenciales inválidas' });
            return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
        }

        // Generar Token usando el UUID 'identificacion'
        const token = jwt.sign(
            { id: usuario.identificacion, rol: usuario.rol_id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' }
        );

        const nombreRol = (usuario.rol_id === 1) ? 'admin' : 'usuario';
        await auditoria(email, 'LOGIN_EXITOSO', ip, agent, { rol: nombreRol });

        res.json({ 
            token, 
            usuario: { 
                nombre: usuario.nombre, 
                email: usuario.email,
                rol: nombreRol 
            } 
        });

    } catch (error) {
        console.error("ERROR EN LOGIN:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

/**
 * NUEVA FUNCIÓN: Login con Google
 */
const loginGoogle = async (req, res) => {
    const { token } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const agent = req.headers['user-agent'];

    try {
        // 1. Verificar el token con Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // 2. Buscar si el usuario ya existe
        let result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        let usuario = result.rows[0];

        // 3. Si no existe, lo creamos automáticamente con Rol 4 (usuario)
        if (!usuario) {
            console.log("Creando nuevo usuario desde Google:", email);
            const nuevoUser = await pool.query(
                'INSERT INTO usuarios (rol_id, nombre, email, password_hash, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [2, name, email, 'google-auth', 'activo']
            );
            usuario = nuevoUser.rows[0];
            await auditoria(email, 'REGISTRO_GOOGLE', ip, agent, { nombre: name });
        }

        // 4. Generar el Token de sesión
        const sessionToken = jwt.sign(
            { id: usuario.identificacion, rol: usuario.rol_id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' }
        );

        await auditoria(email, 'LOGIN_GOOGLE_EXITOSO', ip, agent, { foto: picture });

        res.json({ 
            token: sessionToken, 
            usuario: { 
                nombre: usuario.nombre, 
                email: usuario.email,
                rol: (usuario.rol_id === 1) ? 'admin' : 'usuario' 
            } 
        });

    } catch (error) {
        console.error("Error validando token de Google:", error);
        res.status(401).json({ mensaje: "Token de Google no válido o expirado" });
    }
};

module.exports = { registrar, login, loginGoogle };