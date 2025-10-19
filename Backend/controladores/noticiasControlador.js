const pool = require('../base-datos/conexionSQL');

const listarNoticias = async (req, res) => {
  const resultado = await pool.request().query(`
    SELECT id_noticia, titulo, contenido, fecha_publicacion, imagen FROM noticias ORDER BY fecha_publicacion DESC
  `);
  res.json(resultado.recordset);
};

const registrarReaccion = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo } = req.body;
    await pool.request()
      .input('nombre', nombre)
      .input('tipo', tipo)
      .input('id_noticia', id)
      .query(`
        INSERT INTO reacciones (nombre, tipo, id_noticia, fecha)
        VALUES (@nombre, @tipo, @id_noticia, GETDATE())
      `);
    res.json({ mensaje: 'Reacción registrada' });
  } catch (error) {
    console.error('❌ Error al registrar reacción:', error);
    res.status(500).json({ mensaje: 'Error interno al registrar la reacción.' });
  }
};

const contarReacciones = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.request()
      .input('id_noticia', id)
      .query(`
        SELECT tipo, COUNT(*) AS cantidad
        FROM reacciones
        WHERE id_noticia = @id_noticia
        GROUP BY tipo
      `);
    res.json(resultado.recordset);
  } catch (error) {
    console.error('❌ Error al contar reacciones:', error);
    res.status(500).json({ mensaje: 'Error interno al contar las reacciones.' });
  }
};

const registrarComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { texto } = req.body;
    // Usamos "Anónimo" ya que la tabla espera un nombre y no hay login.
    const nombre_anonimo = 'Anónimo'; 
    await pool.request()
      .input('id_noticia', id)
      .input('nombre', nombre_anonimo)
      .input('contenido', texto)
      .query(`
        INSERT INTO comentarios (id_noticia, nombre, contenido, fecha)
        VALUES (@id_noticia, @nombre, @contenido, GETDATE())
      `);
    res.json({ mensaje: 'Comentario registrado' });
  } catch (error) {
    console.error('❌ Error al registrar comentario:', error);
    res.status(500).json({ mensaje: 'Error interno al registrar el comentario.' });
  }
};

const obtenerComentariosPorNoticia = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await pool.request()
      .input('id_noticia', id)
      .query('SELECT nombre, contenido FROM comentarios WHERE id_noticia = @id_noticia ORDER BY fecha DESC');
    res.json(resultado.recordset);
  } catch (error) {
    console.error('❌ Error al obtener comentarios:', error);
    res.status(500).json({ mensaje: 'Error interno al obtener los comentarios.' });
  }
};

module.exports = {
  listarNoticias,
  registrarReaccion,
  registrarComentario,
  obtenerComentariosPorNoticia,
  contarReacciones
};