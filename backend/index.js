const express = require('express');
const { Pool } = require('pg');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3000;

// 1. Configuración de Swagger / OpenAPI
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Proyecto Base',
      version: '1.0.0',
      description: 'Documentación interactiva de la API',
    },
    servers: [
      {
        url: '/',
        description: 'Servidor base',
      },
    ],
  },
  apis: ['./index.js'], // Archivo donde están los comentarios JSDoc
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// 2. Middleware de Swagger UI (SIN opciones complejas ni rutas extra)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Detecta si está en entorno de desarrollo local o producción
const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('render.com');

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD || 'app_password',
  database: process.env.DB_NAME || 'app_db',
  port: 5432,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

/**
 * @openapi
 * /usuarios:
 *   get:
 *     summary: Obtiene la lista de usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios recuperada con éxito
 */
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

app.listen(port, () => {
  console.log(`Backend escuchando en el puerto ${port}`);
});