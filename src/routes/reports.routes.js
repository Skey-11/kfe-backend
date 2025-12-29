const router = require("express").Router();

router.get("/sold-products", (_, res) => res.json([]));
router.get("/top-products", (_, res) => res.json([]));
router.get("/sales-by-product", (_, res) => res.json([]));

module.exports = router;
