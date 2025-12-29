const service = require("../services/reports.service");

function getRange(req) {
  const { from, to } = req.query;
  if (!from || !to) return null;
  return { from: `${from} 00:00:00`, to: `${to} 23:59:59` };
}

exports.soldProducts = async (req, res) => {
  try {
    const range = getRange(req);
    if (!range) return res.status(400).json({ message: "from y to requeridos (YYYY-MM-DD)" });

    const data = await service.soldProducts(range);
    res.json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.topProducts = async (req, res) => {
  try {
    const range = getRange(req);
    if (!range) return res.status(400).json({ message: "from y to requeridos (YYYY-MM-DD)" });

    const limit = Number(req.query.limit ?? 3);
    const data = await service.topProducts(range, limit);
    res.json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.salesByProduct = async (req, res) => {
  try {
    const range = getRange(req);
    if (!range) return res.status(400).json({ message: "from y to requeridos (YYYY-MM-DD)" });

    const data = await service.salesByProduct(range);
    res.json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
