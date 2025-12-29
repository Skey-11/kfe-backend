const router = require("express").Router();
const controller = require("../controllers/sales.controller");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");

router.post("/", requireAuth, requireRole("cashier", "admin", "manager"), controller.create);

module.exports = router;
