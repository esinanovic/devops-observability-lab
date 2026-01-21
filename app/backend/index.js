// backend/index.js
const express = require('express');
const db = require('./config/database');
const { register, metricsMiddleware } = require('./metrics');
const cors = require('cors');

const app = express();


app.use(cors());
app.use(metricsMiddleware);


const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running and listening on port ${PORT}`);
});


app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get('/', (req, res) => res.send('Hello World!'));


app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/getAll', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM test ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur /getAll:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
});


app.get('/api/status', async (req, res) => {
  try {
    const dbResult = await db.query('SELECT NOW() as time, version() as version');
    
    res.json({
      status: 'success',
      message: 'API and database are working',
      timestamp: new Date().toISOString(),
      data: {
        environment: process.env.NODE_ENV || 'development',
        database: {
          connected: true,
          time: dbResult.rows[0].time,
          version: dbResult.rows[0].version
        }
      }
    });
    
  } catch (dbError) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: dbError.message, // L'erreur est envoyée au client (ton test JS), pas à la console Docker !
      timestamp: new Date().toISOString()
    });
  }
});


module.exports = app;