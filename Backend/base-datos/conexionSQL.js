const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    trustServerCertificate: true
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

poolConnect.then(() => {
  console.log('✅ Conexión a SQL Server establecida');
}).catch(err => {
  console.error('❌ Error de conexión:', err);
});

module.exports = pool;