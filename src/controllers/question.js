const express = require("express");
const response = require("../modules/response");
const Question = require("../models/Question");

const router = express.Router();

router.post("/create", async (req, res) => {
  const QuestionObj = req.body;
  const { token } = req.headers;
  try {
    const result = await new Question(token).Create(QuestionObj);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.post("/update", async (req, res) => {
  const QuestionObj = req.body;
  const { token } = req.headers;
  try {
    const result = await new Question(token).Update(QuestionObj);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.get("/data", async (req, res) => {
  const { token } = req.headers;
  const ReqInfo = req.query;

  try {
    const result = await new Question(token).GetData(ReqInfo);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});
router.get("/reviews", async (req, res) => {
  const { token } = req.headers;

  try {
    const result = await new Question(token).GetAllData();
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.delete("/delete", async (req, res) => {
  const { token } = req.headers;
  const QuestionID = req.query.question_id;

  try {
    const result = await new Question(token).Delete(QuestionID);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});
module.exports = router;
