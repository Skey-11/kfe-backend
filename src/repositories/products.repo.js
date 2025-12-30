const pool = require("../config/db");
const { normalizeName } = require("../utils/normalize");


exports.list = async () => {
  const [rows] = await pool.query(
    `SELECT id, name, price, stock, track_stock, is_active
     FROM products
     ORDER BY id DESC`
  );
  return rows;
};


exports.reactivate = async (id) => {
  const [r] = await pool.query(
    "UPDATE products SET is_active = 1 WHERE id = ? AND is_active = 0",
    [id]
  );
  return r.affectedRows;
};

exports.findByNameNormalized = async (name) => {
  const normalized = normalizeName(name);

  const [rows] = await pool.query(
    "SELECT id, is_active FROM products WHERE name = ? LIMIT 1",
    [normalized]
  );

  return rows[0] || null;
};

exports.findByNameNormalizedExcludingId = async (name, excludeId) => {
  const normalized = normalizeName(name);

  const [rows] = await pool.query(
    `SELECT id, is_active
     FROM products
     WHERE name = ?
       AND id <> ?
     LIMIT 1`,
    [normalized, Number(excludeId)]
  );

  return rows[0] || null;
};


exports.create = async ({ name, price, is_active, stock, track_stock }) => {
  const [r] = await pool.query(
    "INSERT INTO products (name, price, is_active, stock, track_stock) VALUES (?, ?, ?, ?, ?)",
    [name, price, is_active ? 1 : 0, stock ?? 0, track_stock ? 1 : 0]
  );
  return r.insertId;
};

exports.update = async (id, { name, price, is_active, stock, track_stock }) => {
  
  if (stock === undefined) {
    const [r] = await pool.query(
      `UPDATE products
       SET name = COALESCE(?, name),
           price = COALESCE(?, price),
           is_active = COALESCE(?, is_active),
           track_stock = COALESCE(?, track_stock)
       WHERE id = ?
         AND is_active = 1`,
      [name ?? null, price ?? null, is_active ?? null, track_stock ?? null, id]
    );
    return r.affectedRows;
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [r] = await conn.query(
      `UPDATE products
       SET name = COALESCE(?, name),
           price = COALESCE(?, price),
           is_active = COALESCE(?, is_active),
           track_stock = COALESCE(?, track_stock)
       WHERE id = ?
         AND is_active = 1`,
      [name ?? null, price ?? null, is_active ?? null, track_stock ?? null, id]
    );

    if (!r.affectedRows) throw new Error("Producto no encontrado");

    const [rows] = await conn.query(
      "SELECT stock FROM products WHERE id = ? AND is_active = 1 FOR UPDATE",
      [id]
    );
    if (!rows.length) throw new Error("Producto no encontrado");

    const currentStock = Number(rows[0].stock);
    const newStock = Number(stock);
    const delta = newStock - currentStock;

    if (delta !== 0) {
      await conn.query(
        `INSERT INTO stock_movements (product_id, qty, reason, note)
         VALUES (?, ?, 'adjust', ?)`,
        [id, delta, "Ajuste desde edición de producto"]
      );

      const [u] = await conn.query(
        `UPDATE products
         SET stock = stock + ?
         WHERE id = ?
           AND is_active = 1
           AND stock + ? >= 0`,
        [delta, id, delta]
      );

      if (!u.affectedRows) throw new Error("Stock insuficiente");
    }

    await conn.commit();
    return 1;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};

exports.softDelete = async (id) => {
  const [r] = await pool.query(
    "UPDATE products SET is_active = 0 WHERE id = ? AND is_active = 1",
    [id]
  );
  return r.affectedRows;
};

exports.listByIds = async (ids) => {
  if (!ids?.length) return [];

  const uniqueIds = [...new Set(ids)];
  const placeholders = uniqueIds.map(() => "?").join(",");

  const [rows] = await pool.query(
    `SELECT id, price, stock, track_stock, is_active
     FROM products
     WHERE is_active = 1
       AND id IN (${placeholders})`,
    uniqueIds
  );
  return rows;
};
