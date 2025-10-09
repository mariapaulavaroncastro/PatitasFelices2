const pool = require('../base-datos/conexionSQL');

const publicarNoticiaConImagen = async (req, res) => {
  const { titulo, contenido, id_admin } = req.body;
  const imagen = req.file ? req.file.filename : null;

  await pool.request()
    .input('titulo', titulo)
    .input('contenido', contenido)
    .input('id_admin', id_admin)
    .input('imagen', imagen)
    .query(`
      INSERT INTO noticias (titulo, contenido, fecha_publicacion, id_admin, imagen)
      VALUES (@titulo, @contenido, GETDATE(), @id_admin, @imagen)
    `);

  res.json({ mensaje: 'Noticia publicada con imagen' });
};

const listarNoticias = async (req, res) => {
  const resultado = await pool.request().query(`
    SELECT id_noticia, titulo, contenido, fecha_publicacion, imagen FROM noticias
    ORDER BY fecha_publicacion DESC
  `);
  res.json(resultado.recordset);
};

const eliminarNoticia = async (req, res) => {
  const { id } = req.params;
  await pool.request().input('id', id).query(`
    DELETE FROM noticias WHERE id_noticia = @id
  `);
  res.json({ mensaje: 'Noticia eliminada' });
};

const actualizarNoticia = async (req, res) => {
  const { id } = req.params;
  const { titulo, contenido } = req.body;
  const imagen = req.file ? req.file.filename : null;

  let query = `
    UPDATE noticias
    SET titulo = @titulo, contenido = @contenido
  `;
  if (imagen) query += `, imagen = @imagen`;
  query += ` WHERE id_noticia = @id`;

  await pool.request()
    .input('id', id)
    .input('titulo', titulo)
    .input('contenido', contenido)
    .input('imagen', imagen)
    .query(query);

  res.json({ mensaje: 'Noticia actualizada' });
};

module.exports = {
  publicarNoticiaConImagen,
  listarNoticias,
  eliminarNoticia,
  actualizarNoticia
};