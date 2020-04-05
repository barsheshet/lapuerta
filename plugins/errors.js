const fp = require('fastify-plugin');

module.exports = fp(async function (fastify) {
  class ValidationError extends Error {}
  class OperationError extends Error {}
  class UniqueError extends Error {}

  fastify.decorate('ValidationError', ValidationError);
  fastify.decorate('OperationError', OperationError);
  fastify.decorate('UniqueError', UniqueError);

  fastify.decorate('handleError', function (e) {
    if (e instanceof ValidationError) {
      return fastify.httpErrors.badRequest(e.message);
    }
    if (e instanceof OperationError) {
      return fastify.httpErrors.badRequest(e.message);
    }
    if (e instanceof UniqueError) {
      return fastify.httpErrors.conflict('entity already exists');
    }
    throw e;
  });
});
