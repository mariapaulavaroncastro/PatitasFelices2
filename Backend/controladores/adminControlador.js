const pool = require('../base-datos/conexionSQL');

const loginAdmin = async (req, res) => {
  const { correo, contrasena } = req.body; 

  try {
    // Consulta optimizada para PostgreSQL (Supabase)
    const resultado = await pool.query(
      'SELECT id_admin, nombre FROM administradores WHERE correo = $1 AND contrasena = $2',
      [correo, contrasena]
    );

    if (resultado.rows.length > 0) {
      res.json({ 
        acceso: true, 
        id_admin: resultado.rows[0].id_admin,
        nombre: resultado.rows[0].nombre 
      });
    } else {
      res.json({ acceso: false, mensaje: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error(' Error en login:', error.message);
    res.status(500).json({ acceso: false, mensaje: 'Error de servidor' });
  }
};

module.exports = { loginAdmin };