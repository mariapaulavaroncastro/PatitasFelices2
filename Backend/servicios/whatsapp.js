const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const enviarWhatsApp = async (numeroDestino, mensaje) => {
  try {
    await client.messages.create({
      from: 'whatsapp:+14155238886', // número sandbox
      to: `whatsapp:${numeroDestino}`, // debe incluir el prefijo +57
      body: mensaje
    });
    console.log(`📲 WhatsApp enviado a ${numeroDestino}`);
  } catch (error) {
    console.error('❌ Error al enviar WhatsApp:', error);
  }
};

module.exports = enviarWhatsApp;