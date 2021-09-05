const express = require("express");
const response = require("../modules/response");
const Test = require("../models/Test");

const router = express.Router();

router.post("/create", async (req, res) => {
  const TestObj = req.body;
  const { token } = req.headers;
  try {
    const result = await new Test(token).Create(TestObj);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.post("/update", async (req, res) => {
  const TestObj = req.body;
  const { token } = req.headers;
  try {
    const result = await new Test(token).Update(TestObj);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.get("/data", async (req, res) => {
  const { token } = req.headers;
  const ReqInfo = req.query;
  try {
    const result = await new Test(token).GetData(ReqInfo);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.delete("/delete", async (req, res) => {
  const { token } = req.headers;
  const testID = req.body.test_id;

  try {
    const result = await new Test(token).Delete(testID);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});
module.exports = router;
