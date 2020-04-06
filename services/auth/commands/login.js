const httpStatus = require('http-status');

module.exports = async function (fastify) {
  fastify.route({
    url: '/login',
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
        [httpStatus.OK]: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: httpStatus[httpStatus.OK],
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
      const userRepository = fastify.repository.user;

      let user = await userRepository.findOne({ email: req.body.email });

      if (!user) {
        return fastify.httpErrors.unauthorized('Wrong email or password');
      }

      try {
        user = await user.checkPassword(req.body.password);
      } catch (e) {
        return fastify.httpErrors.unauthorized('Wrong email or password');
      }

      return {
        status: httpStatus[httpStatus.OK],
        data: {
          idToken: 'abcd',
        },
      };
    },
  });
};
