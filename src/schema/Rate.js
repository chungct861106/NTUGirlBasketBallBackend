const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Schema = mongoose.Schema;

const RateSchema = new Schema({
  id: { type: mongoose.Types.ObjectId },
  user_id: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  question_id: {
    type: mongoose.Types.ObjectId,
    ref: "question",
    required: true,
  },
  rate: {
    type: Number,
    default: 3,
  },
});

const Rate = mongoose.model("Rate", RateSchema);

module.exports = Rate;
