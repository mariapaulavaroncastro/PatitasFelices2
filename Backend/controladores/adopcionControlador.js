const pool = require('../base-datos/conexionSQL');

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

const registrarSolicitudAdopcion = async (req, res) => {
  // Aquí iría la lógica para guardar la solicitud de adopción en la base de datos.
  // Por ahora, solo enviamos una respuesta de éxito.
  console.log('📝 Nueva solicitud de adopción recibida:', req.body);
  res.json({ mensaje: '✅ ¡Tu solicitud de adopción ha sido recibida! Nos pondremos en contacto contigo pronto.' });
};

module.exports = {
  listarAdopcionesPublico,
  registrarSolicitudAdopcion
};