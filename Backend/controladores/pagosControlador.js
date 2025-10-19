const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const pool = require('../base-datos/conexionSQL');

// 1. Configura el SDK de Mercado Pago con tu Access Token
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

/**
 * Crea una preferencia de pago en Mercado Pago.
 */
const crearPreferencia = async (req, res) => {
  const { monto, nombre, telefono } = req.body;

  // 2. Define la preferencia de pago
  const preferenceData = {
    body: {
      items: [
        {
          title: 'Donación para Patitas Felices',
          description: `Aporte de ${nombre}`,
          quantity: 1,
          currency_id: 'COP',
          unit_price: Number(monto),
        },
      ],
      // 3. URLs a las que se redirigirá al usuario después del pago
      back_urls: {
        success: 'http://127.0.0.1:5500/Frontend/secciones/donacion-exitosa.html', // URL para pago exitoso
        failure: 'http://127.0.0.1:5500/Frontend/secciones/donacion.html', // URL para pago fallido
        pending: 'http://127.0.0.1:5500/Frontend/secciones/donacion.html', // URL para pago pendiente
      },
      auto_return: 'approved', // Redirige automáticamente solo si el pago es aprobado
      notification_url: 'https://TU_URL_PUBLICA/pagos/webhook', // URL para recibir notificaciones (webhooks)
    }
  };

  try {
    const preference = new Preference(client);
    const respuesta = await preference.create(preferenceData);
    // 4. Envía la URL de pago (init_point) al frontend
    res.json({ init_point: respuesta.init_point });
  } catch (error) {
    console.error('Error al crear preferencia de pago:', error);
    res.status(500).json({ mensaje: 'Error al procesar el pago' });
  }
};

/**
 * Recibe notificaciones de Mercado Pago (Webhooks).
 */
const recibirWebhook = async (req, res) => {
  const { query } = req;
  console.log('Webhook recibido:', query);

  if (query.type === 'payment') {
    try {
      const paymentId = query['data.id'];
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: paymentId });

      // Aquí puedes usar paymentInfo para actualizar tu base de datos.
      // Por ejemplo, guardar el paymentId y el estado 'approved' en tu tabla de donaciones.
      console.log(`Pago recibido: ${paymentId}. Estado: ${paymentInfo.status}. Actualizando base de datos...`);
    } catch (error) {
      console.error('Error al procesar webhook:', error);
    }
  }

  res.sendStatus(200); // Responde a Mercado Pago para confirmar la recepción
};

module.exports = { crearPreferencia, recibirWebhook };