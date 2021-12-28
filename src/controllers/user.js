const express = require("express");
const User = require("../models/User");
const response = require("../modules/response");
const router = express.Router();

router.post("/create", async (req, res) => {
  const userObj = req.body;
  try {
    const result = await new User().Create(userObj);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.put("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await new User().Login(email, password);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.post("/active", async (req, res) => {
  const { token } = req.headers;
  try {
    const result = await new User(token).Active();
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.post("/update", async (req, res) => {
  const updateObj = req.body;
  const { token } = req.headers;
  try {
    const result = await new User(token).Update(updateObj);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.get("/checkToken", async (req, res) => {
  const { token } = req.query;
  try {
    const result = await new User().CheckToken(token);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.get("/data", async (req, res) => {
  const { token } = req.headers;
  try {
    const result = await new User(token).GetData();
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.put("/remind", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await new User().Remind(email);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});
router.put("/resend", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await new User().Resend(email);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

module.exports = router;
