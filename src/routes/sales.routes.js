const router = require("express").Router();

router.post("/", (_, res) => res.status(201).json({ message: "sales ok (placeholder)" }));

module.exports = router;
