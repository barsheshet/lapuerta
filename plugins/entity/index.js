const fp = require('fastify-plugin');
const User = require('./user');

module.exports = fp(async function (fastify) {
  const entities = {
    User,
  };

  fastify.decorate('entity', entities);
});
