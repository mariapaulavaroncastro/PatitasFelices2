const pool = require('../base-datos/conexionSQL');
const enviarWhatsApp = require('../servicios/whatsapp');

const listarAdopcionesPublico = async (req, res) => {
  try {
    const resultado = await pool.request().query(`
      SELECT id_adopcion, nombre, edad, descripcion, imagen, categoria 
      FROM adopciones 
      ORDER BY nombre
    `);
    res.json(resultado.recordset);
  } catch (error) {
    console.error('❌ Error al listar adopciones públicas:', error);
    res.status(500).json({ mensaje: 'Error interno al obtener las adopciones.' });
  }
};

const registrarSolicitud = async (req, res) => {
  const { nombre, telefono, correo, mascota, mensaje } = req.body; // Esperamos 'mascota' (el nombre)

  try {
    // Validación básica
    if (!nombre || !telefono || !correo || !mascota) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    // Inserción en SQL Server
    await pool.request()
      .input('nombre', nombre)
      .input('telefono', telefono)
      .input('correo', correo)
      .input('mascota', mascota) // Guardamos el nombre de la mascota
      .input('mensaje', mensaje || '') // Evita null
      .query(`
        INSERT INTO solicitudes_adopcion (nombre, telefono, correo, mascota, mensaje)
        VALUES (@nombre, @telefono, @correo, @mascota, @mensaje);
      `);

    // Mensaje por WhatsApp
    const texto = `Hola ${nombre}, recibimos tu solicitud para adoptar a ${mascota} 🐾. Pronto nos pondremos en contacto contigo para continuar el proceso. ¡Gracias por confiar en Patitas Felices!`;

    await enviarWhatsApp(telefono, texto);

    res.status(201).json({ mensaje: 'Solicitud registrada y mensaje enviado por WhatsApp' });
  } catch (error) {
    console.error('❌ Error al registrar adopción:', error);
    res.status(500).json({ mensaje: 'Error interno al registrar la solicitud' });
  }
};

module.exports = { 
  registrarSolicitud,
  listarAdopcionesPublico 
};