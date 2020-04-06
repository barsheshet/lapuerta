const UserMapper = require('./user.mapper');

module.exports = class UserRepository {
  constructor({ knex, User }) {
    this.knex = knex;
    this.mapper = UserMapper(User);
  }

  async create(user) {
    const data = this.mapper.toDatabase(user);
    try {
      const created = await this.knex('users').returning().insert(data);
      return this.mapper.toEntity(created);
    } catch (e) {
      if (e.code === '23505') {
        return null;
      } else {
        throw e;
      }
    }
  }

  async findOne({ id, email }) {
    let where = {};
    if (id) {
      where.id = id;
    }
    if (email) {
      where.email = email;
    }
    const user = await this.knex('users').first().where(where);
    if (!user) {
      return null;
    }
    return this.mapper.toEntity(user);
  }

  async update(user) {
    const data = this.mapper.toDatabase(user);
    const id = data.id;
    delete data.id;
    const updated = await this.knex('users')
      .update(data)
      .returning()
      .where({ id });
    if (!updated[0]) {
      return null;
    }
    return this.mapper.toEntity(updated[0]);
  }

  async delete(user) {
    const { id } = this.mapper.toDatabase(user);
    const deleted = await this.knex('users').delete().returning().where({ id });
    if (!deleted[0]) {
      return null;
    }
    return this.mapper.toEntity(deleted[0]);
  }
};
