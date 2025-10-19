const pool = require('../base-datos/conexionSQL');


const registrarDonacion = async (req, res) => {
  const { nombre, telefono, monto, medio, mensaje } = req.body;

  try {
    await pool.request()
      .input('nombre', nombre)
      .input('telefono', telefono)
      .input('monto', monto)
      .input('medio', medio)
      .input('mensaje', mensaje || '')
      .query(`
        INSERT INTO donaciones (nombre, telefono, monto, medio, mensaje)
        VALUES (@nombre, @telefono, @monto, @medio, @mensaje)
      `);

    res.status(201).json({
      mensaje: 'Donación registrada exitosamente',
      enlacePago: 'https://link.mercadopago.com.co/patitasfelicespagos'
    });
  } catch (error) {
    console.error('❌ Error al registrar donación:', error);
    res.status(500).json({ mensaje: 'Error al registrar donación', detalle: error.message });

  }
};

module.exports = { registrarDonacion };