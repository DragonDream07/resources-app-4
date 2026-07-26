/**
 * Migration: 020_create_return_requests
 * Creates the return_requests table with a FK to orders.
 */
exports.up = async function (knex) {
  await knex.schema.createTable('return_requests', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table
      .integer('requested_by_user_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.string('status', 64).notNullable().defaultTo('requested');
    table.string('reason', 512).notNullable();
    table.text('description').nullable();
    table.jsonb('items').nullable();
    table
      .integer('reviewed_by_user_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.text('review_notes').nullable();
    table.timestamp('reviewed_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('return_requests');
};
