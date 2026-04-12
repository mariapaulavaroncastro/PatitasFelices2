const pool = require('../base-datos/conexionSQL');


//  1. CREAR MASCOTA (CON URL)

const crearAdopcionConImagen = async (req, res) => {
  try {
    // Ahora recibimos imagen_url directamente desde el texto del formulario
    const { nombre, edad, descripcion, categoria, imagen_url } = req.body;

    if (!nombre || !edad || !descripcion || !categoria || !imagen_url) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios o la URL de la imagen.' });
    }

    const query = `
      INSERT INTO mascotas (nombre, edad, descripcion, categoria_id, imagen_url, estado)
      VALUES ($1, $2, $3, $4, $5, 'disponible')
    `;
    await pool.query(query, [nombre, edad, descripcion, categoria, imagen_url]);
    
    res.status(201).json({ mensaje: ' Mascota publicada con éxito' });
  } catch (error) {
    console.error(' Error al crear mascota:', error);
    res.status(500).json({ mensaje: 'Error interno al crear mascota' });
  }
};


// 2. LISTAR MASCOTAS (ADMIN)

const listarAdopciones = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT 
        m.id AS id_adopcion, 
        m.nombre, 
        m.edad, 
        m.descripcion, 
        m.imagen_url AS imagen, 
        c.nombre AS categoria 
      FROM mascotas m
      LEFT JOIN categorias c ON m.categoria_id = c.id
      ORDER BY m.nombre
    `);
    res.json(resultado.rows);
  } catch (error) {
    console.error(' Error al listar mascotas:', error);
    res.status(500).json({ mensaje: 'Error interno al listar mascotas' });
  }
};  


//  3. ELIMINAR MASCOTA

const eliminarAdopcion = async (req, res) => {
  try {
    const { id } = req.params;
    // Ya no necesitamos borrar archivos, solo eliminamos de la base de datos
    await pool.query('DELETE FROM mascotas WHERE id = $1', [id]);
    res.json({ mensaje: ' Mascota eliminada correctamente' });
  } catch (error) {
    console.error(' Error al eliminar mascota:', error);
    res.status(500).json({ mensaje: 'Error interno al eliminar mascota' });
  }
};

//  4. ACTUALIZAR MASCOTA

const actualizarAdopcion = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, edad, descripcion, categoria, imagen_url } = req.body;

    await pool.query(
      `UPDATE mascotas SET nombre = $1, edad = $2, descripcion = $3, categoria_id = $4, imagen_url = $5 WHERE id = $6`,
      [nombre, edad, descripcion, categoria, imagen_url, id]
    );
    
    res.json({ mensaje: ' Mascota actualizada correctamente' });
  } catch (error) {
    console.error(' Error al actualizar mascota:', error);
    res.status(500).json({ mensaje: 'Error interno al actualizar mascota' });
  }
};

module.exports = { crearAdopcionConImagen, listarAdopciones, eliminarAdopcion, actualizarAdopcion };