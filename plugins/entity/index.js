const fp = require('fastify-plugin');
const User = require('./user');

module.exports = fp(async function (fastify) {
  const { ValidationError, OperationError } = fastify;

  const entities = {
    User: User({
      ValidationError,
      OperationError,
    }),
  };

  fastify.decorate('entity', entities);
});
