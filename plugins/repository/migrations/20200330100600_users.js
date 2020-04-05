exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.string('id').primary();
    table.string('tenant').notNullable();
    table.string('email').notNullable();
    table.string('mobile').nullable();
    table.text('password').nullable();
    table.boolean('is_sms_two_fa').notNullable();
    table.jsonb('info').notNullable();
    table.specificType('roles', 'varchar[]').notNullable();
    table.boolean('is_email_verified').notNullable();
    table.boolean('is_mobile_verified').notNullable();
    table.jsonb('providers').notNullable();
    table.string('email_verification_token').nullable();
    table.datetime('email_verification_expires').nullable();
    table.string('mobile_verification_code').nullable();
    table.datetime('mobile_verification_expires').nullable();
    table.string('reset_password_token').nullable();
    table.datetime('reset_password_expires').nullable();
    table.datetime('created').notNullable();
    table.datetime('updated').nullable();

    table.unique('email');
    table.unique('mobile');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
