import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('favorites', table => {
    table.uuid('user_id').notNullable().references('id').inTable('users')
    table.uuid('listing_id').notNullable().references('id').inTable('listings')
    table.primary(['user_id', 'listing_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('favorites')
}
