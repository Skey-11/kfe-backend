const express = require("express");
const router = express.Router();
const stockService = require("../services/stock.service");


router.post("/movements", async (req, res) => {
  try {
    const ok = await stockService.createMovement(req.body);
    res.json({ ok });
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });
  }
});


router.get("/products/:id/movements", async (req, res) => {
  try {
    const items = await stockService.listMovements(req.params.id, req.query.limit);
    res.json(items);
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });
  }
});

module.exports = router;
