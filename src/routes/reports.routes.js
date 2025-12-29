const router = require("express").Router();
const controller = require("../controllers/reports.controller");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");

router.use(requireAuth, requireRole("manager", "admin"));

router.get("/sold-products", controller.soldProducts);
router.get("/top-products", controller.topProducts);
router.get("/sales-by-product", controller.salesByProduct);

module.exports = router;
