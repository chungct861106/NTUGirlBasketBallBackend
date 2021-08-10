const express = require("express");
const response = require("../modules/response");
const Player = require("../models/Player");

const router = express.Router();

router.post("/create", async (req, res) => {
  const PlayerObj = req.body;
  const { token } = req.header;
  try {
    const result = await new Player(token).Create(PlayerObj);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.post("/update", async (req, res) => {
  const PlayerObj = req.body;
  const { token } = req.header;
  try {
    const result = await new Player(token).Update(PlayerObj);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.get("/data", async (req, res) => {
  const { token } = req.header;
  const ReqInfo = req.query;
  try {
    const result = await new Player(token).GetData(ReqInfo);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.delete("/delete", async (req, res) => {
  const { token } = req.header;
  const PlayerID = req.body.player_id;
  try {
    const result = await new Player(token).Delete(PlayerID);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});
module.exports = router;
