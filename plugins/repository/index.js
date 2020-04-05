const fp = require('fastify-plugin');
const Knex = require('knex');
const UserRepository = require('./user/user.repository');

module.exports = fp(async function (fastify) {
  const config = fastify.config;
  const knex = Knex({
    client: config.DB_CLIENT,
    connection: {
      host: config.DB_HOST,
      port: config.DB_PORT,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
    },
    useNullAsDefault: true,
    migrations: {
      directory: './plugins/repository/migrations',
    },
    seeds: {
      directory: './plugins/repository/seeds',
    },
    debug: config.DB_DEBUG,
  });

  try {
    await knex.raw('SELECT 1+1');
  } catch (e) {
    fastify.log.error('Database connection failed!');
    fastify.log.error(e);
    process.exit(1);
  }

  try {
    fastify.log.info('Knex migration is running...');
    await knex.migrate.latest();
    fastify.log.info('Knex migration complete.');
  } catch (e) {
    fastify.log.error(e);
    process.exit(1);
  }
  const User = fastify.entity.User;
  const { UniqueError } = fastify;
  const repository = {
    user: new UserRepository({ knex, User, UniqueError }),
  };

  fastify.decorate('repository', repository);
});
