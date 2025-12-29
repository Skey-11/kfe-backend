const router = require("express").Router();
const controller = require("../controllers/products.controller");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");

router.use(requireAuth);

router.get("/", requireRole("cashier", "manager", "admin"), controller.list);

router.post("/", requireRole("manager", "admin"), controller.create);
router.put("/:id", requireRole("manager", "admin"), controller.update);
router.delete("/:id", requireRole("manager", "admin"), controller.softDelete);
router.patch("/:id/reactivate",requireRole("manager", "admin"), controller.reactivate);

module.exports = router;
