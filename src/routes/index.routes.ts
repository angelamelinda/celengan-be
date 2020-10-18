import express from "express";
const user = require("./user.routes");
const category = require("./category.routes");
const budget = require("./budget.routes");
const cashflow = require("./cashflow.routes");

const router = express.Router();

router.use("/api/v1/user", user);
router.use("/api/v1/category", category);
router.use("/api/v1/budget", budget);
router.use("/api/v1/cashflow", cashflow);

module.exports = router;
