const repo = require("../repositories/products.repo");

exports.list = async () => repo.list();

exports.create = async ({ name, price, is_active }) => {
  
  if (!name || price == null) throw new Error("name y price son requeridos");
  return repo.create({ name, price, is_active });
};

exports.update = async (id, dto) => repo.update(id, dto);

exports.softDelete = async (id) => repo.softDelete(id);
