const router = require("express").Router();
const pool = require("../config/db");

router.get("/db-test", async (_, res) => {
  const [rows] = await pool.query("SELECT 1 + 1 AS result");
  res.json(rows);
});

module.exports = router;
