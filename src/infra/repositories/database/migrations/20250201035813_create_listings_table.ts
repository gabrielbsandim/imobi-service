import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('listings', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.uuid('buyer_id').notNullable().references('id').inTable('users')
    table.string('buyer_phone_number').notNullable()

    table.enum('transaction_type', ['buy', 'rent']).notNullable()

    table.enum('property_type', ['house', 'apartment', 'studio']).nullable()

    table.enum('bedrooms', [0, 1, 2, 3]).nullable()
    table.enum('bathrooms', [0, 1, 2]).nullable()

    table.enum('parking_spaces', [0, 1, 2]).nullable()
    table.enum('size', [0, 1, 2, 3]).nullable()

    table.string('city', 100).notNullable()

    table.enum('price', [0, 1, 2, 3]).nullable()

    table.text('description').notNullable()

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('listings')
}
