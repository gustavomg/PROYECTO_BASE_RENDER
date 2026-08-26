const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de conexión flexible (local / Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    `postgres://${process.env.DB_USER || 'app_user'}:${process.env.DB_PASSWORD || 'app_password'}@${process.env.DB_HOST || 'db'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'app_db'}`,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

app.get('/', (req, res) => {
  res.json({ message: "API funcionando correctamente" });
});

app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios;');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error conectando a la BD", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});