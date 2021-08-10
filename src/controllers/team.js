const express = require("express");
const response = require("../modules/response");
const Team = require("../models/Team");

const router = express.Router();

router.post("/create", async (req, res) => {
  const TeamObj = req.body;
  const { token } = req.header;
  try {
    const result = await new Team(token).Create(TeamObj);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.post("/update", async (req, res) => {
  const TeamObj = req.body;
  const { token } = req.header;
  try {
    const result = await new Team(token).Update(TeamObj);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.post("/assign", async (req, res) => {
  const TeamObj = req.body;
  const { token } = req.header;
  try {
    const result = await new Team(token).Assign(TeamObj);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.get("/data", async (req, res) => {
  const { token } = req.header;
  const ReqInfo = req.query;
  try {
    const result = await new Team(token).GetData(ReqInfo);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.delete("/delete", async (req, res) => {
  const { token } = req.header;
  const teamID = req.body.team_id;
  try {
    const result = await new Team(token).Delete(teamID);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});
module.exports = router;
