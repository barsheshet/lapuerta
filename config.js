module.exports = {
  type: 'object',
  required: [],
  properties: {
    DB_CLIENT: {
      type: 'string',
      enum: ['mysql', 'pg', 'sqlite3', 'postgres', 'oracledb', 'mssql'],
      default: 'pg',
    },
    DB_HOST: { type: 'string', default: '127.0.0.1' },
    DB_PORT: { type: 'string', default: '5432' },
    DB_USER: { type: 'string', default: 'postgres' },
    DB_PASSWORD: { type: 'string', default: null },
    DB_NAME: { type: 'string', default: 'lapuerta' },
    DB_DEBUG: { type: 'boolean', default: false }
  },
  additionalProperties: false,
};
