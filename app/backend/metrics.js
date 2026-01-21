const client = require('prom-client');

const register = new client.Registry();

// Collecte des métriques système (CPU, RAM)
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requêtes HTTP reçues',
  labelNames: ['method', 'status']
});
register.registerMetric(httpRequestsTotal);

// Middleware
const metricsMiddleware = (req, res, next) => {
  res.on('finish', () => {
    httpRequestsTotal.inc({ method: req.method, status: res.statusCode });
  });
  next();
};

module.exports = {
  register,
  metricsMiddleware
};