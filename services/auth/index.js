const signup = require('./commands/signup');
const login = require('./commands/login');

module.exports = async function (fastify) {
  fastify.register(signup);
  fastify.register(login);
};

module.exports.autoPrefix = '/api/v1/auth';
