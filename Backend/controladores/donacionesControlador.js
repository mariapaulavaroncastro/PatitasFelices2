// controllers/donacionesControlador.js
const pool = require('../base-datos/conexionSQL'); // Tu conexión de Supabase (PostgreSQL)
const Donacion = require('../modelos/modeloDonacion');

const registrarDonacion = async (req, res) => {
    try {
        // 1. Instanciar el modelo con los datos del body
        const datosDonacion = new Donacion(req.body);

        // 2. Ejecutar validación del modelo
        datosDonacion.evaluarViabilidadTransaccional();

        // 3. Persistencia en PostgreSQL (Supabase)
        // Nota: Cambiamos .request().input() por parámetros posicionales ($1, $2, etc.)
        const queryText = `
            INSERT INTO donaciones 
            (nombre_donante, correo_donante, monto, metodo_pago_id, estado_pago, telefono, mensaje, usuario_id)
            VALUES ($1, $2, $3, $4, 'pendiente', $5, $6, $7)
            RETURNING id;
        `;

        const values = [
            datosDonacion.nombre,
            datosDonacion.correo,
            datosDonacion.monto,
            datosDonacion.metodo_pago_id,
            datosDonacion.telefono,
            datosDonacion.mensaje,
            datosDonacion.usuario_id
        ];

        // Ejecutamos la consulta usando el pool de 'pg'
        const resultado = await pool.query(queryText, values);

        // 4. Respuesta exitosa
        res.status(201).json({
            mensaje: '✅ Donación validada y registrada en el sistema',
            id_donacion: resultado.rows[0].id, // En PostgreSQL los resultados están en .rows
            enlacePago: 'https://link.mercadopago.com.co/patitasfelicespagos'
        });

    } catch (error) {
        console.error(' Error en el proceso de donación:', error.message);
        
        res.status(400).json({ 
            mensaje: 'Error al procesar la donación', 
            detalle: error.message 
        });
    }
};

module.exports = { registrarDonacion };