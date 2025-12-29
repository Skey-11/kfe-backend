const router = require("express").Router();
const controller = require("../controllers/products.controller");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");


router.use(requireAuth, requireRole("manager", "admin"));

router.get("/", controller.list);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.softDelete);

module.exports = router;
