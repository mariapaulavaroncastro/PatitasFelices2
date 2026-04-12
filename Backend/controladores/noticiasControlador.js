const pool = require('../base-datos/conexionSQL');

// 1. Publicar noticia
const publicarNoticiaConImagen = async (req, res) => {
  try {
    const { titulo, contenido, id_admin, imagen_url } = req.body;

    if (!titulo || !contenido || !id_admin || !imagen_url) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
    }

    const query = `
      INSERT INTO noticias (titulo, contenido, fecha_publicacion, id_admin, imagen)
      VALUES ($1, $2, NOW(), $3, $4)
    `;

    await pool.query(query, [titulo, contenido, id_admin, imagen_url]);

    res.status(201).json({ mensaje: '✅ Noticia publicada con éxito' });
  } catch (error) {
    console.error('❌ Error al publicar noticia:', error);
    res.status(500).json({ mensaje: 'Error interno al publicar la noticia.' });
  }
};

// 2. Listar noticias (Aquí estaba el error de pool.request)
const listarNoticias = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT id_noticia, titulo, contenido, fecha_publicacion, imagen 
      FROM noticias 
      ORDER BY fecha_publicacion DESC
    `);
    
    // En PostgreSQL/pg, los datos están en .rows
    res.json(resultado.rows); 
  } catch (error) {
    console.error(' Error al listar noticias:', error);
    res.status(500).json({ mensaje: 'Error interno al obtener las noticias.' });
  }
};

// 3. Eliminar noticia
const eliminarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'DELETE FROM noticias WHERE id_noticia = $1';
    const resultado = await pool.query(query, [id]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensaje: 'La noticia no existe.' });
    }

    res.json({ mensaje: ' Noticia eliminada correctamente' });
  } catch (error) {
    console.error(' Error al eliminar noticia:', error);
    res.status(500).json({ mensaje: 'Error interno al eliminar la noticia.' });
  }
};

// 4. Actualizar noticia
const actualizarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido, imagen_url } = req.body;

    const query = `
      UPDATE noticias 
      SET titulo = $1, contenido = $2, imagen = $3 
      WHERE id_noticia = $4
    `;

    const resultado = await pool.query(query, [titulo, contenido, imagen_url, id]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Noticia no encontrada.' });
    }

    res.json({ mensaje: ' Noticia actualizada correctamente' });
  } catch (error) {
    console.error(' Error al actualizar noticia:', error);
    res.status(500).json({ mensaje: 'Error interno al actualizar.' });
  }
};

module.exports = {
  publicarNoticiaConImagen,
  listarNoticias,
  eliminarNoticia,
  actualizarNoticia
};