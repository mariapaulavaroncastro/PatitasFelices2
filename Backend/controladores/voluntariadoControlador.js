const pool = require('../base-datos/conexionSQL');
const enviarWhatsApp = require('../servicios/whatsapp');

const registrarVoluntario = async (req, res) => {
  const { nombre, telefono, correo, horario, mensaje } = req.body;

  try {
    await pool.request()
      .input('nombre', nombre)
      .input('telefono', telefono)
      .input('correo', correo)
      .input('horario', horario)
      .input('mensaje', mensaje || '')
      .query(`
        INSERT INTO voluntarios (nombre, telefono, correo, horario, mensaje)
        VALUES (@nombre, @telefono, @correo, @horario, @mensaje)
      `);

    const texto = `🙌 ¡Hola ${nombre}! Gracias por tu interés en ser voluntario en Patitas Felices 🐾. Tu disponibilidad: ${horario}. Pronto nos pondremos en contacto contigo para coordinar actividades. ¡Gracias por tu apoyo! 💛`;

    await enviarWhatsApp(telefono, texto);

    res.status(201).json({ mensaje: 'Solicitud registrada y mensaje enviado por WhatsApp' });
  } catch (error) {
    console.error('❌ Error al registrar voluntario:', error);
    res.status(500).json({ mensaje: 'Error al registrar voluntario' });
  }
};

module.exports = { registrarVoluntario };