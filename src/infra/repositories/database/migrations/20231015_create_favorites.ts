import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('favorites', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.uuid('broker_id').notNullable().references('id').inTable('users')
    table.uuid('listing_id').notNullable().references('id').inTable('listings')
    table.unique(['broker_id', 'listing_id'])

    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('favorites')
}
