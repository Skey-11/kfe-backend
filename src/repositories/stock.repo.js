const pool = require("../config/db");

exports.createMovement = async ({ product_id, qty, reason, note }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `INSERT INTO stock_movements (product_id, qty, reason, note)
       VALUES (?, ?, ?, ?)`,
      [product_id, qty, reason, note ?? null]
    );

 
    const [r] = await conn.query(
      `UPDATE products
       SET stock = stock + ?
       WHERE id = ?
         AND stock + ? >= 0`,
      [qty, product_id, qty]
    );

    if (!r.affectedRows) {
      throw new Error("Stock insuficiente o producto no existe");
    }

    await conn.commit();
    return true;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};

exports.listMovementsByProduct = async (product_id, limit = 50) => {
  const [rows] = await pool.query(
    `SELECT id, product_id, qty, reason, note, created_at
     FROM stock_movements
     WHERE product_id = ?
     ORDER BY id DESC
     LIMIT ?`,
    [product_id, Number(limit)]
  );
  return rows;
};
