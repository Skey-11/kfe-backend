const service = require("../services/sales.service");

exports.create = async (req, res) => {
  try {
    const result = await service.create(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
