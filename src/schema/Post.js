const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  id: {
    type: mongoose.Types.ObjectId,
  },
  type: {
    type: String,
    required: [true, "Post Type is required."],
  },
  title_catagory: {
    type: String,
    required: [true, "Tilte Catagroy is required."],
  },
  title_content: {
    type: String,
    default: "No Title",
    unique: true,
  },
  content: {
    type: String,
    default: "No Content",
  },
  active: {
    type: Boolean,
    default: false,
  },
  create_time: {
    type: Date,
    default: moment.tz(Date.now(), "Asia/Taipei"),
  },
  user_id: { type: mongoose.Types.ObjectId, ref: "user" },
});

const Post = mongoose.model("post", PostSchema);

module.exports = Post;
