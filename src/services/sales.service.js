const repo = require("../repositories/sales.repo");
const productsRepo = require("../repositories/products.repo");

exports.create = async ({ sold_at, items }) => {
  if (!Array.isArray(items) || items.length === 0) throw new Error("items es requerido");

  for (const it of items) {
    if (!it.product_id || !Number.isInteger(it.qty) || it.qty <= 0) {
      throw new Error("Cada item requiere product_id y qty > 0");
    }
  }

  const productIds = items.map((i) => i.product_id);
  const products = await productsRepo.listByIds(productIds);

  const map = new Map(products.map((p) => [p.id, p]));
  for (const it of items) {
    const p = map.get(it.product_id);
    if (!p) throw new Error(`Producto no existe: ${it.product_id}`);
    if (p.is_active !== 1) throw new Error(`Producto inactivo: ${it.product_id}`);
  }

  const computedItems = items.map((it) => {
    const p = map.get(it.product_id);
    const unitPrice = Number(p.price);
    const lineTotal = Number((unitPrice * it.qty).toFixed(2));
    return { product_id: it.product_id, qty: it.qty, unit_price: unitPrice, line_total: lineTotal };
  });

  const total = Number(computedItems.reduce((acc, x) => acc + x.line_total, 0).toFixed(2));
  const soldAt = sold_at ? new Date(sold_at) : new Date();

  const saleId = await repo.createSaleWithItems(soldAt, total, computedItems);
  return { sale_id: saleId, total };
};
