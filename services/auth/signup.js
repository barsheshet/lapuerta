const httpStatus = require('http-status');

module.exports = async function (fastify) {
  fastify.route({
    url: '/signup',
    method: 'POST',
    schema: {
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        additionalProperties: false,
        properties: {
          email: {
            type: 'string',
            format: 'email',
          },
          password: {
            type: 'string',
            minLength: 10,
            maximum: 128,
          },
        },
      },
      response: {
        [httpStatus.CREATED]: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: httpStatus[httpStatus.CREATED],
            },
            data: {
              type: 'object',
              properties: {
                idToken: {
                  type: 'string',
                  example: 'abcd',
                },
              },
            },
          },
        },
      },
    },
    handler: async function (req) {
      try {
        const User = fastify.entity.User;
        const repository = fastify.repository.user;

        const user = new User();

        user.setEmail(req.body.email);
        await user.setPassword(req.body.password);

        await repository.create(user);
      } catch (e) {
        return fastify.handleError(e);
      }

      return {
        status: httpStatus[httpStatus.CREATED],
        data: {
          idToken: 'abcd',
        },
      };
    },
  });
};
