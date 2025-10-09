const pool = require('../base-datos/conexionSQL');

const obtenerNoticias = async (req, res) => {
  const resultado = await pool.request().query(`
    SELECT id_noticia, titulo, contenido, fecha_publicacion FROM noticias ORDER BY fecha_publicacion DESC
  `);
  res.json(resultado.recordset);
};

const registrarReaccion = async (req, res) => {
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
};

const contarReacciones = async (req, res) => {
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
};

const registrarComentario = async (req, res) => {
  const { id } = req.params;
  const { texto } = req.body;

  await pool.request()
    .input('id_noticia', id)
    .input('texto', texto)
    .query(`
      INSERT INTO comentarios (id_noticia, texto, fecha)
      VALUES (@id_noticia, @texto, GETDATE())
    `);

  res.json({ mensaje: 'Comentario registrado' });
};

const obtenerComentarios = async (req, res) => {
  const { id } = req.params;
  const resultado = await pool.request()
    .input('id_noticia', id)
    .query(`
      SELECT texto, fecha FROM comentarios
      WHERE id_noticia = @id_noticia
      ORDER BY fecha DESC
    `);
  res.json(resultado.recordset);
};

module.exports = {
  obtenerNoticias,
  registrarReaccion,
  registrarComentario,
  obtenerComentarios,
  contarReacciones
};