const pool = require('../base-datos/conexionSQL');
const enviarWhatsApp = require('../servicios/whatsapp');

// 1. Listar Mascotas (Público)
const listarAdopcionesPublico = async (req, res) => {
  try {
// ... dentro de listarAdopcionesPublico ...
const query = `
  SELECT 
    m.id, 
    m.nombre, 
    m.edad, 
    m.descripcion, 
    m.imagen_url,  -- <-- CAMBIO AQUÍ: Quité el "AS imagen"
    c.nombre AS categoria,
    m.estado
  FROM mascotas m
  LEFT JOIN categorias c ON m.categoria_id = c.id
  WHERE m.estado = 'disponible'
  ORDER BY m.nombre ASC
`;

    const resultado = await pool.query(query);
    res.json(resultado.rows);

  } catch (error) {
    console.error('❌ Error al listar mascotas público:', error.message);
    res.status(500).json({ mensaje: 'Error interno al obtener las mascotas.' });
  }
};

// 2. Registrar Solicitud (Conexión Formulario -> BD -> WhatsApp)
const registrarSolicitud = async (req, res) => {
  const { nombre, telefono, correo, mascota, mensaje } = req.body; 

  try {
    if (!nombre || !telefono || !mascota) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    // PASO A: Buscar el ID de la mascota basándonos en el nombre
    // CAMBIO: 'id' en lugar de 'id_mascota'
    const mascotaQuery = await pool.query(
      'SELECT id FROM mascotas WHERE nombre = $1', 
      [mascota]
    );

    if (mascotaQuery.rows.length === 0) {
      return res.status(404).json({ mensaje: 'La mascota solicitada no existe.' });
    }

    const idMascotaEncontrado = mascotaQuery.rows[0].id;

    // PASO B: Insertar la solicitud usando los nombres de columna de TU SQL
    // CAMBIO: 'nombre_solicitante', 'mascota_id'
    await pool.query(
      `INSERT INTO solicitudes_adopcion 
      (nombre_solicitante, telefono, correo, mensaje, mascota_id) 
      VALUES ($1, $2, $3, $4, $5)`,
      [nombre, telefono, correo, mensaje || '', idMascotaEncontrado]
    );

    // PASO C: Enviar WhatsApp
    const texto = `Hola ${nombre}, recibimos tu solicitud para adoptar a ${mascota} 🐾. Pronto nos pondremos en contacto contigo. ¡Gracias por confiar en Patitas Felices!`;
    
    try {
      await enviarWhatsApp(telefono, texto);
      console.log(' WhatsApp enviado correctamente');
    } catch (wsError) {
      console.error(' Solicitud guardada, pero falló WhatsApp:', wsError.message);
    }

    res.status(201).json({ mensaje: 'Solicitud registrada con éxito' });

  } catch (error) {
    console.error(' Error al registrar solicitud:', error.message);
    res.status(500).json({ mensaje: 'Error interno al procesar tu solicitud.' });
  }
};

module.exports = { 
  registrarSolicitud,
  listarAdopcionesPublico 
};