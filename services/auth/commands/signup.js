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
      const User = fastify.entity.User;
      const userRepository = fastify.repository.user;
      let user = new User();

      try {
        user = await user
          .setEmail(req.body.email)
          .setPassword(req.body.password);
      } catch (e) {
        return fastify.httpErrors.badRequest(e.message);
      }

      user = await userRepository.create(user);

      if (!user) {
        return fastify.httpErrors.conflict('User already exists');
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
