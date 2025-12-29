const express = require("express");
const cors = require("cors");

const productsRoutes = require("./routes/products.routes");
const salesRoutes = require("./routes/sales.routes");
const reportsRoutes = require("./routes/reports.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.use("/api/products", productsRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/reports", reportsRoutes);

module.exports = app;
