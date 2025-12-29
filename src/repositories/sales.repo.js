const pool = require("../config/db");

exports.createSaleWithItems = async (soldAt, items) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const ids = [...new Set(items.map((i) => Number(i.product_id)))];
    const placeholders = ids.map(() => "?").join(",");

    const [products] = await conn.query(
      `SELECT id, price, stock, track_stock, is_active
       FROM products
       WHERE is_active = 1 AND id IN (${placeholders})
       FOR UPDATE`,
      ids
    );

    if (products.length !== ids.length) {
      throw new Error("Uno o más productos no existen o están eliminados");
    }

    const map = new Map(products.map((p) => [p.id, p]));
    const qtyById = new Map();
    for (const it of items) {
      const pid = Number(it.product_id);
      const qty = Number(it.qty);
      qtyById.set(pid, (qtyById.get(pid) || 0) + qty);
    }

    for (const [pid, qty] of qtyById.entries()) {
      const p = map.get(pid);
      if (!p) throw new Error(`Producto no existe: ${pid}`);

      if (Number(p.track_stock) === 1) {
        if (Number(p.stock) < qty) throw new Error(`Stock insuficiente para producto`); // id=${pid}
      }
    }

    const computedItems = items.map((it) => {
      const p = map.get(Number(it.product_id));
      const unitPrice = Number(p.price);
      const lineTotal = Number((unitPrice * Number(it.qty)).toFixed(2));
      return {
        product_id: Number(it.product_id),
        qty: Number(it.qty),
        unit_price: unitPrice,
        line_total: lineTotal,
        track_stock: Number(p.track_stock),
      };
    });

    const total = Number(computedItems.reduce((acc, x) => acc + x.line_total, 0).toFixed(2));

    const [saleRes] = await conn.query(
      "INSERT INTO sales (sold_at, total) VALUES (?, ?)",
      [soldAt, total]
    );
    const saleId = saleRes.insertId;

    for (const it of computedItems) {
      await conn.query(
        "INSERT INTO sale_items (sale_id, product_id, qty, unit_price, line_total) VALUES (?, ?, ?, ?, ?)",
        [saleId, it.product_id, it.qty, it.unit_price, it.line_total]
      );
    }

    for (const it of computedItems) {
      if (it.track_stock === 1) {
        const delta = -it.qty;

        await conn.query(
          `INSERT INTO stock_movements (product_id, qty, reason, note)
           VALUES (?, ?, 'sale', ?)`,
          [it.product_id, delta, `Venta #${saleId}`]
        );

        const [u] = await conn.query(
          `UPDATE products
           SET stock = stock + ?
           WHERE id = ?
             AND is_active = 1
             AND stock + ? >= 0`,
          [delta, it.product_id, delta]
        );

        if (!u.affectedRows) throw new Error("Stock insuficiente (conflicto de concurrencia)");
      }
    }

    await conn.commit();
    return { sale_id: saleId, total };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};
