const repo = require("../repositories/sales.repo");

exports.create = async ({ sold_at, items }) => {
  if (!Array.isArray(items) || items.length === 0) throw new Error("items es requerido");

  for (const it of items) {
    if (!it.product_id || !Number.isInteger(it.qty) || it.qty <= 0) {
      throw new Error("Cada item requiere product_id y qty > 0");
    }
  }

  const soldAt = sold_at ? new Date(sold_at) : new Date();
  return repo.createSaleWithItems(soldAt, items);
};
