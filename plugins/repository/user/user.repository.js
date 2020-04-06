const makeError = require('make-error');
const UserMapper = require('./user.mapper');

const UniqueError = makeError('UniqueError');

module.exports = class UserRepository {
  constructor({ knex, User }) {
    this.knex = knex;
    this.mapper = UserMapper(User);
  }

  async create(user) {
    const data = this.mapper.toDatabase(user);
    try {
      await this.knex('users').insert(data);
    } catch (e) {
      if (e.code === '23505') {
        throw new UniqueError(e.detail);
      } else {
        throw e;
      }
    }
  }

  update(user) {
    const data = this.mapper.toDatabase(user);
    const id = data.id;
    delete data.id;
    return this.knex('users').update(data).where({ id });
  }

  delete(user) {
    const data = this.mapper.toDatabase(user);
    return this.knex('users').delete().where({ id: data.id });
  }
};
