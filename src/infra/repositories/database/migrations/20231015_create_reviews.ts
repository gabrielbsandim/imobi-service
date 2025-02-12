import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('reviews', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.uuid('buyer_id').notNullable().references('id').inTable('users')
    table.uuid('broker_id').notNullable().references('id').inTable('users')
    table.integer('rating').notNullable()
    table.unique(['buyer_id', 'broker_id'])

    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('reviews')
}
