const service = require("../services/products.service");

exports.list = async (_, res) => {
  const data = await service.list();
  res.json(data);
};

exports.create = async (req, res) => {
  try {
    const { name, price, is_active = 1 } = req.body;
    const id = await service.create({ name, price, is_active });
    res.status(201).json({ id });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, is_active } = req.body;
    const updated = await service.update(id, { name, price, is_active });
    res.json({ updated });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.softDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const deactivated = await service.softDelete(id);
    res.json({ deactivated });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
