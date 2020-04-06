const fp = require('fastify-plugin');

module.exports = fp(async function (fastify) {
  fastify.decorate('handleError', async function (e) {
    if (e.name === 'ValidationError') {
      throw fastify.httpErrors.badRequest(e.message);
    }
    if (e.name === 'OperationError') {
      throw fastify.httpErrors.badRequest(e.message);
    }
    if (e.name === 'UniqueError') {
      throw fastify.httpErrors.conflict(e.message);
    }
    throw e;
  });
});
