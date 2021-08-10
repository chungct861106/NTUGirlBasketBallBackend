const express = require("express");
const response = require("../modules/response");
const Post = require("../models/Post");

const router = express.Router();

router.post("/create", async (req, res) => {
  const PostObj = req.body;
  const { token } = req.header;
  try {
    const result = await new Post(token).Create(PostObj);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.post("/update", async (req, res) => {
  const PostObj = req.body;
  const { token } = req.header;
  try {
    const result = await new Post(token).Update(PostObj);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});
router.get("/getType", async (req, res) => {
  const { token } = req.header;
  const ReqInfo = req.query;
  try {
    const result = await new Post(token).GetData(ReqInfo);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});

router.delete("/delete", async (req, res) => {
  const { token } = req.header;
  const postID = req.body.post_id;
  try {
    const result = await new Post(token).Delete(postID);
    return response.succ(res, result);
  } catch (err) {
    return response.fail(res, err);
  }
});
module.exports = router;
