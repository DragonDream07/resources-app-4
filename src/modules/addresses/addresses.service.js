const db = require('../../config/db');

async function getAddresses(userId) {
  const { rows } = await db.query(
    `SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC`,
    [userId]
  );
  return rows;
}

async function getAddressById(userId, addressId) {
  const { rows } = await db.query(
    `SELECT * FROM addresses WHERE id = $1 AND user_id = $2`,
    [addressId, userId]
  );
  if (rows.length === 0) {
    const err = new Error('Address not found.');
    err.status = 404;
    throw err;
  }
  return rows[0];
}

async function createAddress(userId, payload) {
  const {
    full_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    pin_code,
    country,
    is_default,
  } = payload;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    await checkServiceability(pin_code, client);

    if (is_default) {
      await client.query(
        `UPDATE addresses SET is_default = FALSE WHERE user_id = $1`,
        [userId]
      );
    }

    const { rows } = await client.query(
      `INSERT INTO addresses
        (user_id, full_name, phone, address_line1, address_line2, city, state, pin_code, country, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        userId,
        full_name,
        phone,
        address_line1,
        address_line2 || null,
        city,
        state,
        pin_code,
        country || 'India',
        is_default || false,
      ]
    );

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function updateAddress(userId, addressId, payload) {
  const existing = await getAddressById(userId, addressId);

  const {
    full_name = existing.full_name,
    phone = existing.phone,
    address_line1 = existing.address_line1,
    address_line2 = existing.address_line2,
    city = existing.city,
    state = existing.state,
    pin_code = existing.pin_code,
    country = existing.country,
    is_default = existing.is_default,
  } = payload;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    if (pin_code && pin_code !== existing.pin_code) {
      await checkServiceability(pin_code, client);
    }

    if (is_default) {
      await client.query(
        `UPDATE addresses SET is_default = FALSE WHERE user_id = $1`,
        [userId]
      );
    }

    const { rows } = await client.query(
      `UPDATE addresses
       SET full_name = $1,
           phone = $2,
           address_line1 = $3,
           address_line2 = $4,
           city = $5,
           state = $6,
           pin_code = $7,
           country = $8,
           is_default = $9,
           updated_at = NOW()
       WHERE id = $10 AND user_id = $11
       RETURNING *`,
      [
        full_name,
        phone,
        address_line1,
        address_line2 || null,
        city,
        state,
        pin_code,
        country,
        is_default,
        addressId,
        userId,
      ]
    );

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function deleteAddress(userId, addressId) {
  await getAddressById(userId, addressId);

  const { rowCount } = await db.query(
    `DELETE FROM addresses WHERE id = $1 AND user_id = $2`,
    [addressId, userId]
  );

  if (rowCount === 0) {
    const err = new Error('Address not found.');
    err.status = 404;
    throw err;
  }
}

async function checkServiceability(pinCode, client) {
  const queryRunner = client || db;
  const { rows } = await queryRunner.query(
    `SELECT id FROM serviceable_pin_codes WHERE pin_code = $1 AND is_active = TRUE`,
    [pinCode]
  );
  if (rows.length === 0) {
    const err = new Error('Delivery is not available at the provided pin code.');
    err.status = 422;
    throw err;
  }
}

module.exports = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  checkServiceability,
};
