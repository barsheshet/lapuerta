const status = require('http-status');

module.exports = async function (fastify) {
  fastify.route({
    url: '/',
    method: 'GET',
    schema: {
      description: 'Returns 200 OK if the service is up and running',
      summary: 'Health Check',
      tags: ['general'],
      response: {
        [status.OK]: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: status[status.OK],
            },
          },
        },
      },
    },
    handler: async function () {
      return { status: status[status.OK] };
    },
  });
};
