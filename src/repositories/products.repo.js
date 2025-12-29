const pool = require("../config/db");

exports.list = async () => {
  const [rows] = await pool.query("SELECT * FROM products ORDER BY id DESC");
  return rows;
};

exports.create = async ({ name, price, is_active }) => {
  const [r] = await pool.query(
    "INSERT INTO products (name, price, is_active) VALUES (?, ?, ?)",
    [name, price, is_active ? 1 : 0]
  );
  return r.insertId;
};

exports.update = async (id, { name, price, is_active }) => {
  const [r] = await pool.query(
    "UPDATE products SET name = COALESCE(?, name), price = COALESCE(?, price), is_active = COALESCE(?, is_active) WHERE id = ?",
    [name ?? null, price ?? null, is_active ?? null, id]
  );
  return r.affectedRows;
};

exports.softDelete = async (id) => {
  const [r] = await pool.query("UPDATE products SET is_active = 0 WHERE id = ?", [id]);
  return r.affectedRows;
};

exports.listByIds = async (ids) => {
  if (!ids?.length) return [];

  
  const uniqueIds = [...new Set(ids)];
  const placeholders = uniqueIds.map(() => "?").join(",");

  const [rows] = await pool.query(
    `SELECT id, price, is_active FROM products WHERE id IN (${placeholders})`,
    uniqueIds
  );
  return rows;
};

