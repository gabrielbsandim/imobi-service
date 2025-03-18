import type { Knex } from 'knex'

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'secret',
    database: 'postgres',
  },
  migrations: {
    directory: './src/infra/repositories/database/migrations',
  },
}

export default config
