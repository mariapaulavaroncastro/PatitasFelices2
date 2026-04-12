const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión a Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Importante para que Supabase acepte la conexión
  }
});

// Prueba de conexión inmediata
pool.connect()
  .then(client => {
    console.log(' Conexión exitosa a Supabase (PostgreSQL)');
    client.release(); // Soltamos el cliente para no ocupar memoria
  })
  .catch(err => {
    console.error(' Error fatal de conexión:', err.message);
    console.error(' Revisa que tu archivo .env tenga la variable DATABASE_URL correcta');
  });

module.exports = pool;