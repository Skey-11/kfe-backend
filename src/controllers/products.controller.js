const service = require("../services/products.service");

exports.list = async (_, res) => {
  const data = await service.list();
  res.json(data);
};

exports.create = async (req, res) => {
  try {
    const { name, price, is_active = 1, stock, track_stock } = req.body;
    const id = await service.create({ name, price, is_active, stock, track_stock });
    res.status(201).json({ id });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, is_active, stock, track_stock } = req.body;

    const updated = await service.update(id, { name, price, is_active, stock, track_stock });
    if (!updated) return res.status(404).json({ message: "Producto no encontrado" });

    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.softDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const deactivated = await service.softDelete(id);
    if (!deactivated) return res.status(404).json({ message: "Producto no encontrado" });

    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};