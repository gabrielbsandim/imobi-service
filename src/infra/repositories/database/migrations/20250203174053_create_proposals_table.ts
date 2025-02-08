import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('proposals', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.uuid('listing_id').notNullable().references('id').inTable('listings')
    table.uuid('broker_id').notNullable().references('id').inTable('users')

    table.text('message').notNullable()
    table.specificType('photoUrls', 'text ARRAY').notNullable()
    table.enum('status', ['pending', 'accepted', 'rejected']).notNullable()

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('proposals')
}
