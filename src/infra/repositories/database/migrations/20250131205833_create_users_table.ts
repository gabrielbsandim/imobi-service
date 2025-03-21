import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

  return knex.schema.createTable('users', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('email').unique().notNullable()
    table.string('name').notNullable()
    table.string('password').notNullable()
    table.enum('user_type', ['buyer', 'broker']).notNullable()
    table.text('refresh_token').nullable()
    table.boolean('email_verified').defaultTo(false)
    table.string('verification_code').nullable()
    table.timestamp('verification_code_expiry').nullable()
    table.string('reset_password_code').nullable()
    table.timestamp('reset_password_code_expiry').nullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users')
}
