import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

  return knex.schema.createTable('users', table => {
    table.uuid('id').primary()
    table.string('email').unique().notNullable()
    table.string('name').notNullable()
    table.string('password').notNullable()
    table.enum('user_type', ['buyer', 'broker']).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users')
}
