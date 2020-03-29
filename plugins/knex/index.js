'use strict';

const fp = require('fastify-plugin');
const Knex = require('knex');

module.exports = fp(async function (fastify) {
  const config = fastify.config;
  const knex = Knex({
    client: config.DB_CLIENT,
    connection: {
      host: config.DB_HOST,
      port: config.DB_PORT,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME
    },
    useNullAsDefault: true,
    migrations: {
      directory: './plugins/knex/migrations'
    },
    seeds: {
      directory: './plugins/knex/seeds'
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

  fastify.decorate('knex', knex);
});