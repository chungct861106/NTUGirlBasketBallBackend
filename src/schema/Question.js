const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  id: { type: mongoose.Types.ObjectId },
  user_id: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  create_user_id: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },

  title: {
    type: String,
    unique: true,
    require: [true, "Name is required"],
  },
  type: {
    type: String,
    default: "QA",
  },
  option1: {
    type: String,
    default: null,
  },
  option2: {
    type: String,
    default: null,
  },
  create_time: {
    type: Date,
    default: moment.tz(Date.now(), "Asia/Taipei"),
  },
});

const Question = mongoose.model("question", QuestionSchema);

module.exports = Question;
