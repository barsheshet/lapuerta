const signup = require('./signup');

module.exports = async function (fastify) {
  fastify.register(signup);
};

module.exports.autoPrefix = '/api/v1/auth';
