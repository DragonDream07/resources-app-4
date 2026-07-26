/**
 * Migration: 018_create_payment_attempts
 * Creates the payment_attempts table with a FK to orders.
 */
exports.up = async function (knex) {
  await knex.schema.createTable('payment_attempts', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table.string('payment_gateway', 64).notNullable();
    table.string('gateway_order_id', 255).nullable();
    table.string('gateway_payment_id', 255).nullable();
    table.string('status', 32).notNullable().defaultTo('initiated');
    table.decimal('amount', 12, 2).notNullable();
    table.string('currency', 8).notNullable().defaultTo('INR');
    table.jsonb('gateway_response').nullable();
    table.string('failure_reason', 512).nullable();
    table.timestamp('attempted_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('completed_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('payment_attempts');
};
