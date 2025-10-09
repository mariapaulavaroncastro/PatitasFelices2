const pool = require('../base-datos/conexionSQL');

// 🐾 Crear adopción con imagen
const crearAdopcionConImagen = async (req, res) => {
  try {
    const { nombre, edad, descripcion, telefono, categoria, id_admin } = req.body;
    const imagen = req.file ? req.file.filename : null;

    await pool.request()
      .input('nombre', nombre)
      .input('edad', edad)
      .input('descripcion', descripcion)
      .input('telefono', telefono)
      .input('categoria', categoria)
      .input('id_admin', id_admin)
      .input('imagen', imagen)
      .query(`
        INSERT INTO adopciones (nombre, edad, descripcion, telefono, categoria, id_admin, imagen)
        VALUES (@nombre, @edad, @descripcion, @telefono, @categoria, @id_admin, @imagen)
      `);

    res.json({ mensaje: '✅ Animal publicado con imagen' });
  } catch (error) {
    console.error('❌ Error al crear adopción:', error);
    res.status(500).send('Error al crear adopción');
  }
};

// 🐾 Listar adopciones
const listarAdopciones = async (req, res) => {
  try {
    const resultado = await pool.request().query(`
      SELECT id_adopcion, nombre, edad, descripcion, telefono, categoria, imagen FROM adopciones
    `);
    res.json(resultado.recordset);
  } catch (error) {
    console.error('❌ Error al listar adopciones:', error);
    res.status(500).send('Error al listar adopciones');
  }
};

// 🐾 Eliminar adopción
const eliminarAdopcion = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.request()
      .input('id', id)
      .query(`DELETE FROM adopciones WHERE id_adopcion = @id`);
    res.json({ mensaje: '✅ Animal eliminado' });
  } catch (error) {
    console.error('❌ Error al eliminar adopción:', error);
    res.status(500).send('Error al eliminar adopción');
  }
};

// 🐾 Actualizar adopción
const actualizarAdopcion = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, edad, descripcion, telefono, categoria } = req.body;
    const imagen = req.file ? req.file.filename : null;

    let query = `
      UPDATE adopciones
      SET nombre = @nombre,
          edad = @edad,
          descripcion = @descripcion,
          telefono = @telefono,
          categoria = @categoria
    `;
    if (imagen) query += `, imagen = @imagen`;
    query += ` WHERE id_adopcion = @id`;

    await pool.request()
      .input('id', id)
      .input('nombre', nombre)
      .input('edad', edad)
      .input('descripcion', descripcion)
      .input('telefono', telefono)
      .input('categoria', categoria)
      .input('imagen', imagen)
      .query(query);

    res.json({ mensaje: '✅ Animal actualizado' });
  } catch (error) {
    console.error('❌ Error al actualizar adopción:', error);
    res.status(500).send('Error al actualizar adopción');
  }
};

module.exports = {
  crearAdopcionConImagen,
  listarAdopciones,
  eliminarAdopcion,
  actualizarAdopcion
};