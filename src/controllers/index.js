const express = require("express");
const router = express.Router();
const aurthor = require("./authorization");
router.use("*", aurthor.doAuthAction);
router.use("/user", require("./user"));
router.use("/question", require("./question"));
router.use("/rate", require("./rate"));
module.exports = router;
