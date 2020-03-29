const path = require('path');
const AutoLoad = require('fastify-autoload');
const env = require('fastify-env');
const config = require('./config');

module.exports = function (fastify, opts, next) {
  fastify.register(env, { schema: config, data: [opts] });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts),
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({}, opts),
  });

  next();
};
