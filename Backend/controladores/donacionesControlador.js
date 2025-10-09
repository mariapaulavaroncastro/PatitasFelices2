const pool = require('../base-datos/conexionSQL');
const enviarWhatsApp = require('../servicios/whatsapp');

const medios = {
  Nequi: 'Nequi 3001234567',
  Bancolombia: 'Cuenta Bancolombia 123-456789-01'
};

const generarMensajeDonacion = ({ nombre, medio, monto }) => {
  return `🎉 ¡Hola ${nombre}! Gracias por tu generosa donación de $${monto.toLocaleString()} COP a Patitas Felices 🐾.

Tu aporte será destinado al bienestar de nuestros peluditos en adopción.

👉 Medio de pago seleccionado: ${medio}

📌 En breve recibirás confirmación del proceso. Si tienes dudas, puedes escribirnos directamente por este chat.

¡Gracias por hacer parte de esta causa! 💛`;
};

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
  const texto = generarMensajeDonacion({ nombre, medio: medios[medio], monto });
  
  await enviarWhatsApp(telefono, texto);

    res.status(201).json({ mensaje: 'Donación registrada y mensaje enviado por WhatsApp' });
  } catch (error) {
    console.error('❌ Error al registrar donación:', error);
    res.status(500).json({ mensaje: 'Error al registrar donación', detalle: error.message });

  }
};

module.exports = { registrarDonacion };