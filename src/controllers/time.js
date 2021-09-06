const express = require("express");
const response = require("../modules/response");
const Time = require("../models/Time");

const router = express.Router();

router.put("/team/appoint", async (req, res) => {
  const { token } = req.headers;
  const { teamID, timeNumber } = req.body;
  try {
    const result = await new Time(token).Appoint({ timeNumber, teamID });
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.put("/recorder/appoint", async (req, res) => {
  const { token } = req.headers;
  const { userID, timeNumber } = req.body;
  try {
    const result = await new Time(token).Appoint({ timeNumber, userID });
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.get("/data", async (req, res) => {
  const { token } = req.headers;
  const { type } = req.query;
  try {
    const result = await new Time(token).GetTime(type);

    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.get("/team", async (req, res) => {
  const { token } = req.headers;
  const { team_id } = req.query;
  try {
    const result = await new Time(token).GetTimeById({ team_id });
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.get("/user", async (req, res) => {
  const { token } = req.headers;
  const { user_id } = req.query;
  try {
    const result = await new Time(token).GetTimeById({ user_id });
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

module.exports = router;
