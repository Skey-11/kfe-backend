const repo = require("../repositories/products.repo");

exports.list = async () => repo.list();

exports.create = async ({ name, price, is_active, stock, track_stock }) => {
  name = (name || "").trim();

  if (!name || price == null || price === "") throw new Error("name y price son requeridos");

  price = Number(price);
  if (!Number.isFinite(price) || price < 0) throw new Error("price inválido");

  track_stock = track_stock ? 1 : 0;

  if (track_stock === 1) {
    if (stock !== undefined && stock !== null && stock !== "") {
      stock = Number(stock);
      if (!Number.isFinite(stock) || stock < 0) throw new Error("stock inválido");
    } else {
      stock = null;
    }
  } else {
    stock = undefined;
  }

  const existing = await repo.findByName(name);

  if (existing) {
    if (Number(existing.is_active) === 1) {
      throw new Error("Ya existe un producto activo con ese nombre");
    }
    return existing.id;
  }

  return repo.create({ name, price, is_active, stock, track_stock });
};


exports.update = async (id, dto) => {
  if (dto.name !== undefined) {
    dto.name = (dto.name || "").trim();
    if (!dto.name) throw new Error("name no puede quedar vacío");
  }

  if (dto.price !== undefined) {
    if (dto.price === null || dto.price === "") throw new Error("price no puede quedar vacío");
    dto.price = Number(dto.price);
    if (!Number.isFinite(dto.price) || dto.price < 0) throw new Error("price inválido");
  }

  if (dto.track_stock !== undefined) {
    dto.track_stock = dto.track_stock ? 1 : 0;
  }

  if (dto.stock !== undefined) {
    if (dto.stock === null || dto.stock === "") throw new Error("stock no puede quedar vacío");
    dto.stock = Number(dto.stock);
    if (!Number.isFinite(dto.stock) || dto.stock < 0) throw new Error("stock inválido");
  }

  if (dto.track_stock === 0) {
    delete dto.stock;
  }

  return repo.update(id, dto);
};

exports.softDelete = async (id) => repo.softDelete(id);

exports.reactivate = async (id) => repo.reactivate(id);
