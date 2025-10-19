const pool = require('../base-datos/conexionSQL');
const fs = require('fs');
const path = require('path');

// Helper para construir la ruta de la imagen y eliminarla
const eliminarArchivoImagen = (nombreArchivo) => {
  if (!nombreArchivo) return;
  try {
    const rutaImagen = path.join(__dirname, '..', '..', 'Frontend', 'images', nombreArchivo);
    if (fs.existsSync(rutaImagen)) {
      fs.unlinkSync(rutaImagen);
      console.log(`🗑️ Imagen eliminada: ${nombreArchivo}`);
    }
  } catch (error) {
    console.error(`❌ Error al eliminar la imagen ${nombreArchivo}:`, error);
  }
};

const publicarNoticiaConImagen = async (req, res) => {
  try {
    const { titulo, contenido, id_admin } = req.body;
    const imagen = req.file ? req.file.originalname : null;

    // Validar que los datos necesarios están presentes
    if (!titulo || !contenido || !id_admin || !imagen) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios (título, contenido, admin, imagen).' });
    }

    await pool.request()
      .input('titulo', titulo)
      .input('contenido', contenido)
      .input('id_admin', id_admin)
      .input('imagen', imagen)
      .query(`
        INSERT INTO noticias (titulo, contenido, fecha_publicacion, id_admin, imagen)
        VALUES (@titulo, @contenido, GETDATE(), @id_admin, @imagen)
      `);

    res.status(201).json({ mensaje: '✅ Noticia publicada con imagen' });
  } catch (error) {
    console.error('❌ Error al publicar noticia:', error);
    res.status(500).json({ mensaje: 'Error interno al publicar la noticia.' });
  }
};

const listarNoticias = async (req, res) => {
  try {
    const resultado = await pool.request().query(`
      SELECT id_noticia, titulo, contenido, fecha_publicacion, imagen FROM noticias
      ORDER BY fecha_publicacion DESC
    `);
    res.json(resultado.recordset);
  } catch (error) {
    console.error('❌ Error al listar noticias:', error);
    res.status(500).json({ mensaje: 'Error interno al obtener las noticias.' });
  }
};

const eliminarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Obtener el nombre de la imagen antes de borrar el registro
    const resultado = await pool.request()
      .input('id', id)
      .query('SELECT imagen FROM noticias WHERE id_noticia = @id');

    if (resultado.recordset.length > 0) {
      const nombreImagen = resultado.recordset[0].imagen;
      // 2. Eliminar la imagen del servidor
      eliminarArchivoImagen(nombreImagen);
    }

    // 3. Eliminar el registro de la base de datos
    await pool.request().input('id', id).query(`
      DELETE FROM noticias WHERE id_noticia = @id
    `);

    res.json({ mensaje: '✅ Noticia eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar noticia:', error);
    res.status(500).json({ mensaje: 'Error interno al eliminar la noticia.' });
  }
};

const actualizarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido } = req.body;
    const nuevaImagen = req.file ? req.file.originalname : null;

    const request = pool.request();
    let querySet = ['titulo = @titulo', 'contenido = @contenido'];
    request.input('id', id).input('titulo', titulo).input('contenido', contenido);

    if (nuevaImagen) {
      // Si hay una nueva imagen, eliminar la antigua
      const resultado = await pool.request().input('id', id).query('SELECT imagen FROM noticias WHERE id_noticia = @id');
      if (resultado.recordset.length > 0) {
        eliminarArchivoImagen(resultado.recordset[0].imagen);
      }
      querySet.push('imagen = @imagen');
      request.input('imagen', nuevaImagen);
    }

    const query = `UPDATE noticias SET ${querySet.join(', ')} WHERE id_noticia = @id`;
    await request.query(query);

    res.json({ mensaje: '✅ Noticia actualizada correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar noticia:', error);
    res.status(500).json({ mensaje: 'Error interno al actualizar la noticia.' });
  }
};

module.exports = {
  publicarNoticiaConImagen,
  listarNoticias,
  eliminarNoticia,
  actualizarNoticia
};