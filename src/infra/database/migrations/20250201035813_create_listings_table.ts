import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('listings', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.uuid('buyer_id').notNullable().references('id').inTable('users')
    table.string('buyer_phone_number').notNullable()

    table.enum('transaction_type', ['buy', 'rent']).notNullable()
    table
      .enum('property_type', ['house', 'apartment', 'land', 'commercial'])
      .notNullable()

    table.integer('bedrooms').nullable()
    table.integer('bathrooms').nullable()
    table.integer('parking_spaces').nullable()
    table.integer('min_floor').nullable()
    table.decimal('min_size_m2', 8, 2).nullable()
    table.decimal('max_size_m2', 8, 2).nullable()

    table.string('city', 100).notNullable()
    table.string('neighborhood', 100).nullable()

    table.decimal('max_price', 12, 2).nullable()
    table.decimal('min_price', 12, 2).nullable()

    table.text('description').notNullable()

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('listings')
}
