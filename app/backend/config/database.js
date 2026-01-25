const { Pool } = require('pg');

const dbConfig = {
  host: process.env.DB_HOST || 'database',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'observability-db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'secretmdp',
};

//utile pour dev
const pool = new Pool(dbConfig);
pool.on('connect', () => {
  console.log('🔌 New database connection established');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client:', err.message);
});

pool.on('remove', () => {
  console.log('Database connection closed');
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params)
};