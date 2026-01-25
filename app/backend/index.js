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
      error: dbError.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const query = 'sum(rate(http_request_duration_seconds_count[5m]))';
    const url = `http://prometheus:9090/api/v1/query?query=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json({
      status: 'success',
      data: data.data.result
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'appel Prometheus" });
  }
});

module.exports = app;