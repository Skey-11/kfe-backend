const pool = require("../config/db");

exports.soldProducts = async ({ from, to }) => {
  const [rows] = await pool.query(
    `
    SELECT p.id, p.name,
           SUM(si.qty) AS total_qty,
           SUM(si.line_total) AS total_amount
    FROM sale_items si
    JOIN sales s ON s.id = si.sale_id
    JOIN products p ON p.id = si.product_id
    WHERE s.sold_at BETWEEN ? AND ?
    GROUP BY p.id, p.name
    ORDER BY total_amount DESC
    `,
    [from, to]
  );
  return rows;
};

exports.topProducts = async ({ from, to }, limit = 3) => {
  const [rows] = await pool.query(
    `
    SELECT p.id, p.name,
           SUM(si.qty) AS total_qty
    FROM sale_items si
    JOIN sales s ON s.id = si.sale_id
    JOIN products p ON p.id = si.product_id
    WHERE s.sold_at BETWEEN ? AND ?
    GROUP BY p.id, p.name
    ORDER BY total_qty DESC
    LIMIT ?
    `,
    [from, to, Number(limit)]
  );
  return rows;
};

exports.salesByProduct = async ({ from, to }) => {
  const [rows] = await pool.query(
    `
    SELECT p.name AS label,
           SUM(si.line_total) AS value
    FROM sale_items si
    JOIN sales s ON s.id = si.sale_id
    JOIN products p ON p.id = si.product_id
    WHERE s.sold_at BETWEEN ? AND ?
    GROUP BY p.id, p.name
    ORDER BY value DESC
    `,
    [from, to]
  );
  return rows;
};
