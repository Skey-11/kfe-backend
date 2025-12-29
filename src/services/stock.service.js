const repo = require("../repositories/stock.repo");

const allowedReasons = new Set(["purchase", "sale", "adjust", "return"]);

exports.createMovement = async ({ product_id, qty, reason, note }) => {
  product_id = Number(product_id);
  qty = Number(qty);
  reason = (reason || "").trim();

  if (!Number.isFinite(product_id) || product_id <= 0) throw new Error("product_id inválido");
  if (!Number.isFinite(qty) || qty === 0) throw new Error("qty inválida (no puede ser 0)");
  if (!allowedReasons.has(reason))
    throw new Error("reason inválido (purchase|sale|adjust|return)");

  return repo.createMovement({ product_id, qty, reason, note });
};

exports.listMovements = async (product_id, limit) => {
  product_id = Number(product_id);
  if (!Number.isFinite(product_id) || product_id <= 0) throw new Error("product_id inválido");
  return repo.listMovementsByProduct(product_id, limit);
};
