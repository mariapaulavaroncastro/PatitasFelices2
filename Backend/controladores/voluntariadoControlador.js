const pool = require('../base-datos/conexionSQL');
// Nota: Asegúrate de que el servicio de WhatsApp esté configurado, 
// si no lo tienes activo aún, puedes comentar la línea de enviarWhatsApp.
const enviarWhatsApp = require('../servicios/whatsapp'); 

const registrarVoluntario = async (req, res) => {
  // Recibimos los datos del formulario
  const { nombre, telefono, correo, horario, mensaje } = req.body;

  try {
    // 1. Insertar en la tabla 'voluntarios' de Supabase
    // Cambiamos 'horario' por 'disponibilidad' para que coincida con tu CREATE TABLE
    const query = `
      INSERT INTO voluntarios (nombre, telefono, correo, disponibilidad, mensaje, estado_contacto)
      VALUES ($1, $2, $3, $4, $5, 'no_contactado')
    `;

    await pool.query(query, [
      nombre, 
      telefono, 
      correo, 
      horario, // Esto se guardará en la columna 'disponibilidad'
      mensaje || ''
    ]);

    // 2. Intento de enviar WhatsApp (opcional)
    try {
      if (enviarWhatsApp) {
        const texto = ` ¡Hola ${nombre}! Gracias por tu interés en ser voluntario en Patitas Felices 🐾. Tu disponibilidad: ${horario}. Pronto nos pondremos en contacto contigo. ¡Gracias! 💛`;
        await enviarWhatsApp(telefono, texto);
      }
    } catch (wsError) {
      console.warn(' No se pudo enviar el WhatsApp, pero el registro se guardó.');
    }

    res.status(201).json({ 
      mensaje: ' ¡Solicitud registrada exitosamente! Gracias por querer ayudar.' 
    });

  } catch (error) {
    console.error(' Error al registrar voluntario:', error.message);
    res.status(500).json({ mensaje: 'Error al procesar tu solicitud de voluntariado' });
  }
};

module.exports = { registrarVoluntario };