const express = require("express");
const response = require("../modules/response");
const RecordPlayer = require("../models/RecordPlayer");

const router = express.Router();

router.post("/create", async (req, res) => {
  const RecordPlayerObject = req.body;
  const { token } = req.headers;
  try {
    const result = await new RecordPlayer(token).Create(RecordPlayerObject);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.delete("/delete", async (req, res) => {
  const { token } = req.headers;
  const RecordPlayerID = req.body.recordPlayer_id;
  try {
    const result = await new RecordPlayer(token).Delete(RecordPlayerID);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

module.exports = router;
