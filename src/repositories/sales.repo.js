const pool = require("../config/db");

exports.createSaleWithItems = async (soldAt, total, items) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [saleRes] = await conn.query(
      "INSERT INTO sales (sold_at, total) VALUES (?, ?)",
      [soldAt, total]
    );
    const saleId = saleRes.insertId;

    for (const it of items) {
      await conn.query(
        "INSERT INTO sale_items (sale_id, product_id, qty, unit_price, line_total) VALUES (?, ?, ?, ?, ?)",
        [saleId, it.product_id, it.qty, it.unit_price, it.line_total]
      );
    }

    await conn.commit();
    return saleId;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};
