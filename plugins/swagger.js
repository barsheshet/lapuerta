const swagger = require('fastify-swagger');

module.exports = async function (fastify) {
  const swaggerOptions = {
    routePrefix: '/documentation',
    exposeRoute: true,
    swagger: {
      info: {
        title: 'Lapuerta',
        description: '',
        version: '0.1.0',
      },
      host: 'localhost',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  };

  fastify.register(swagger, swaggerOptions);
};
