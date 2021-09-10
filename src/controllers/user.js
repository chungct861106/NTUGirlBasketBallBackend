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
  const { account, password } = req.body;
  try {
    const result = await new User().Login(account, password);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.post("/active", async (req, res) => {
  const { id } = req.body;
  const { token } = req.headers;
  try {
    const result = await new User(token).Active(id);
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
  const { token } = req.header;
  const userQuery = req.query;
  try {
    const result = await new User(token).GetData(userQuery);
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

module.exports = router;
