const { logger } = require('#app/helpers');
let knex = null;
try {
  knex = require('knex')({
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'igf115',
    },
  });
  console.log('Conexión a la base de datos exitosa');
} catch (error) {
  logger.error(error);
}

module.exports = knex;