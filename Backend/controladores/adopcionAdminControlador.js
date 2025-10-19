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

// Crear adopción con imagen
const crearAdopcionConImagen = async (req, res) => {
  try {
    const { nombre, edad, descripcion, categoria, id_admin } = req.body;
    const imagen = req.file ? req.file.originalname : null;

    if (!nombre || !edad || !descripcion || !categoria || !id_admin || !imagen) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
    }

    await pool.request()
      .input('nombre', nombre)
      .input('edad', edad)
      .input('descripcion', descripcion)
      .input('categoria', categoria)
      .input('id_admin', id_admin)
      .input('imagen', imagen)
      .query(`
        INSERT INTO adopciones (nombre, edad, descripcion, categoria, id_admin, imagen)
        VALUES (@nombre, @edad, @descripcion, @categoria, @id_admin, @imagen)
      `);

    res.status(201).json({ mensaje: '✅ Animal publicado para adopción' });
  } catch (error) {
    console.error('❌ Error al crear adopción:', error);
    res.status(500).json({ mensaje: 'Error interno al crear la adopción.' });
  }
};

// 🐾 Listar adopciones
const listarAdopciones = async (req, res) => {
  try {
    const resultado = await pool.request().query('SELECT id_adopcion, nombre, edad, descripcion, imagen, categoria FROM adopciones ORDER BY nombre');
    res.json(resultado.recordset);
  } catch (error) {
    console.error('❌ Error al listar adopciones:', error);
    res.status(500).json({ mensaje: 'Error interno al obtener las adopciones.' });
  }
};  
  

// 🐾 Eliminar adopción
const eliminarAdopcion = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.request().input('id', id).query('SELECT imagen FROM adopciones WHERE id_adopcion = @id');
    if (resultado.recordset.length > 0) {
      eliminarArchivoImagen(resultado.recordset[0].imagen);
    }
    await pool.request().input('id', id).query('DELETE FROM adopciones WHERE id_adopcion = @id');
    res.json({ mensaje: '✅ Animal eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar adopción:', error);
    res.status(500).json({ mensaje: 'Error interno al eliminar la adopción.' });
  }
};

// 🐾 Actualizar adopción
const actualizarAdopcion = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, edad, descripcion, categoria } = req.body;
    const nuevaImagen = req.file ? req.file.filename : null;

    const request = pool.request()
      .input('id', id)
      .input('nombre', nombre)
      .input('edad', edad)
      .input('descripcion', descripcion)
      .input('categoria', categoria);

    let querySet = ['nombre = @nombre', 'edad = @edad', 'descripcion = @descripcion', 'categoria = @categoria'];

    if (nuevaImagen) {
      const resultado = await pool.request().input('id', id).query('SELECT imagen FROM adopciones WHERE id_adopcion = @id');
      if (resultado.recordset.length > 0) {
        eliminarArchivoImagen(resultado.recordset[0].imagen);
      }
      querySet.push('imagen = @imagen');
      request.input('imagen', nuevaImagen);
    }

    const query = `UPDATE adopciones SET ${querySet.join(', ')} WHERE id_adopcion = @id`;
    await request.query(query);

    res.json({ mensaje: '✅ Animal actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar adopción:', error);
   res.status(500).json({ mensaje: 'Error interno al actualizar la adopción.' });
  }
};

module.exports = {
  crearAdopcionConImagen,
  listarAdopciones,
  eliminarAdopcion,
  actualizarAdopcion

};