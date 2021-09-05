const express = require("express");
const response = require("../modules/response");
const Match = require("../models/Match");

const router = express.Router();

router.post("/create", async (req, res) => {
  const MatchObj = req.body;
  const { token } = req.headers;
  try {
    const result = await new Match(token).Create(MatchObj);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.post("/update", async (req, res) => {
  const MatchObj = req.body;
  const { token } = req.headers;
  try {
    const result = await new Match(token).Update(MatchObj);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.get("/data", async (req, res) => {
  const { token } = req.headers;
  const ReqInfo = req.query;
  try {
    const result = await new Match(token).GetData(ReqInfo);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.delete("/delete", async (req, res) => {
  const { token } = req.headers;
  const MatchID = req.body.match_id;
  try {
    const result = await new Match(token).Delete(MatchID);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});
module.exports = router;
