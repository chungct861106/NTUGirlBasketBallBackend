const express = require("express");
const response = require("../modules/response");
const RecordTeam = require("../models/RecordTeam");

const router = express.Router();

router.post("/create", async (req, res) => {
  const RecordTeamObject = req.body;
  const { token } = req.headers;
  try {
    const result = await new RecordTeam(token).Create(RecordTeamObject);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.delete("/delete", async (req, res) => {
  const { token } = req.headers;
  const RecordTeamID = req.body.recordTeam_id;
  try {
    const result = await new RecordTeam(token).Delete(RecordTeamID);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});
router.get("/data", async (req, res) => {
  const { token } = req.headers;
  const ReqInfo = req.query;
  try {
    const result = await new RecordTeam(token).GetData(ReqInfo);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

module.exports = router;
