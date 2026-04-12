const pool = require('../base-datos/conexionSQL');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    //  ESTA LÍNEA ES NUESTRO DETECTIVE 
    console.log("Datos que llegaron del Frontend:", req.body);

    // Capturamos los datos exactamente con los nombres que envía tu HTML/JS
    const email = req.body.correo;
    const password = req.body.contrasena;
    
    let ip_origen = req.ip || req.connection.remoteAddress;

    try {
        // 1. Buscar al usuario en la BD usando SQL puro (pool.query)
        const userResult = await pool.query(
            'SELECT id, nombre, email, password_hash, rol_id, estado FROM usuarios WHERE email = $1',
            [email]
        );

        const usuario = userResult.rows[0]; // Extraemos el usuario encontrado

        // 2. Si no existe o está inactivo
        if (!usuario || usuario.estado !== 'activo') {
            await pool.query(
                'INSERT INTO logs_auditoria (accion, detalles, ip_origen) VALUES ($1, $2, $3)',
                ['LOGIN_FALLIDO_USUARIO', `Intento con email no válido: ${email}`, ip_origen]
            );
            return res.status(401).json({ error: 'Credenciales inválidas (Usuario no encontrado)' });
        }

        // 3. Verificar contraseña encriptada (Criptografía)
        const validPassword = await bcrypt.compare(password, usuario.password_hash);

        if (!validPassword) {
            await pool.query(
                'INSERT INTO logs_auditoria (usuario_id, accion, detalles, ip_origen) VALUES ($1, $2, $3, $4)',
                [usuario.id, 'LOGIN_FALLIDO_CLAVE', 'Contraseña incorrecta', ip_origen]
            );
            return res.status(401).json({ error: 'Credenciales inválidas (Contraseña incorrecta)' });
        }

        // 4. ¡Acceso concedido! Guardar log de éxito y actualizar fecha
        await pool.query(
            'INSERT INTO logs_auditoria (usuario_id, accion, detalles, ip_origen) VALUES ($1, $2, $3, $4)',
            [usuario.id, 'LOGIN_EXITOSO', 'Inicio de sesión correcto', ip_origen]
        );

        await pool.query(
            'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = $1',
            [usuario.id]
        );

        // 5. Enviamos la respuesta de ÉXITO al Frontend
        res.status(200).json({ 
            mensaje: 'Bienvenido ' + usuario.nombre, 
            adminId: usuario.id 
        });

    } catch (err) {
        console.error("Error en login:", err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { login };