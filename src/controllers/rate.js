const express = require("express");
const response = require("../modules/response");
const Rate = require("../models/Rate");

const router = express.Router();

router.post("/", async (req, res) => {
  const RateObj = req.body;
  const { token } = req.headers;
  try {
    const result = await new Rate(token).GiveRate(RateObj);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

module.exports = router;
