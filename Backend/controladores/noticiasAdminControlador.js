const pool = require('../base-datos/conexionSQL');

// 1. Publicar noticia
const publicarNoticiaConImagen = async (req, res) => {
  try {
    const { titulo, contenido, autor_id, imagen_url } = req.body;

    if (!titulo || !contenido || !autor_id || !imagen_url) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios (titulo, contenido, autor_id, imagen_url).' });
    }

    const query = `
      INSERT INTO noticias (titulo, contenido, autor_id, imagen_url, fecha_publicacion)
      VALUES ($1, $2, $3, $4, NOW())
    `;

    await pool.query(query, [titulo, contenido, autor_id, imagen_url]);

    res.status(201).json({ mensaje: ' Noticia publicada con éxito' });
  } catch (error) {
    console.error(' Error al publicar noticia:', error.message);
    res.status(500).json({ mensaje: 'Error al insertar en la base de datos.' });
  }
};

// 2. Listar noticias
const listarNoticias = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT id, titulo, contenido, fecha_publicacion, imagen_url 
      FROM noticias 
      ORDER BY fecha_publicacion DESC
    `);
    
    // Enviamos los datos. Ojo: en el frontend ahora recibes .id e .imagen_url
    res.json(resultado.rows); 
  } catch (error) {
    console.error(' Error al listar noticias:', error.message);
    res.status(500).json({ mensaje: 'Error al consultar noticias.' });
  }
};

// 3. Eliminar noticia
const eliminarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'DELETE FROM noticias WHERE id = $1';
    const resultado = await pool.query(query, [id]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensaje: 'La noticia no existe.' });
    }

    res.json({ mensaje: ' Noticia eliminada correctamente' });
  } catch (error) {
    console.error(' Error al eliminar noticia:', error.message);
    res.status(500).json({ mensaje: 'Error interno al eliminar.' });
  }
};

// 4. Actualizar noticia
const actualizarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido, imagen_url } = req.body;

    const query = `
      UPDATE noticias 
      SET titulo = $1, contenido = $2, imagen_url = $3 
      WHERE id = $4
    `;

    const resultado = await pool.query(query, [titulo, contenido, imagen_url, id]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Noticia no encontrada.' });
    }

    res.json({ mensaje: ' Noticia actualizada correctamente' });
  } catch (error) {
    console.error(' Error al actualizar noticia:', error.message);
    res.status(500).json({ mensaje: 'Error al actualizar.' });
  }
};

module.exports = {
  publicarNoticiaConImagen,
  listarNoticias,
  eliminarNoticia,
  actualizarNoticia
};