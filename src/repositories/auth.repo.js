const pool = require("../config/db");

exports.findUserByUsername = async (username) => {
  const [rows] = await pool.query(
    "SELECT id, username, password_hash, is_active FROM users WHERE username = ?",
    [username]
  );
  return rows[0] || null;
};

exports.getRolesByUserId = async (userId) => {
  const [rows] = await pool.query(
    `SELECT r.name
     FROM user_roles ur
     JOIN roles r ON r.id = ur.role_id
     WHERE ur.user_id = ?`,
    [userId]
  );
  return rows.map(x => x.name);
};
