const repo = require("../repositories/reports.repo");

exports.soldProducts = async (range) => repo.soldProducts(range);

exports.topProducts = async (range, limit) => repo.topProducts(range, limit);

exports.salesByProduct = async (range) => repo.salesByProduct(range);

