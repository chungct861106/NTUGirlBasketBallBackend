const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TimeSchema = new Schema({
  id: { type: mongoose.Types.ObjectId },
  team_id: { type: mongoose.Types.ObjectId, ref: "team", default: null },
  user_id: { type: mongoose.Types.ObjectId, ref: "user", default: null },
  time: [Number],
});

const Time = mongoose.model("time", TimeSchema);

module.exports = Time;
