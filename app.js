const path = require('path');
const AutoLoad = require('fastify-autoload');
const env = require('fastify-env');
const sensible = require('fastify-sensible');
const compress = require('fastify-compress');
const entity = require('./plugins/entity');
const repository = require('./plugins/repository');
const errors = require('./plugins/errors');
const swagger = require('./plugins/swagger');

const config = require('./config');

module.exports = function (fastify, opts, next) {
  fastify.register(env, { schema: config, data: [opts] });
  fastify.register(compress);
  fastify.register(sensible);
  fastify.register(errors);
  fastify.register(entity);
  fastify.register(repository);
  fastify.register(swagger);

  // fastify.register(AutoLoad, {
  //   dir: path.join(__dirname, 'plugins'),
  //   options: Object.assign({}, opts),
  // });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({}, opts),
  });

  next();
};
