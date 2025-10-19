const pool = require('../base-datos/conexionSQL');

const loginAdmin = async (req, res) => {
  const { correo, contrasena } = req.body; 

  const resultado = await pool.request()
   .input('correo', correo) 
.input('contrasena', contrasena)
.query(`
  SELECT id_admin FROM administradores
  WHERE correo = @correo AND contrasena = @contrasena
`)

  if (resultado.recordset.length > 0) {
    res.json({ acceso: true, id_admin: resultado.recordset[0].id_admin });
  } else {
    res.json({ acceso: false });
  }
};

module.exports = { loginAdmin };