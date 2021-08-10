const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  id: {
    type: mongoose.Types.ObjectId,
  },
  user_id: { type: mongoose.Types.ObjectId, ref: "user" },
  name: {
    type: String,
    unique: true,
    required: [true, "Team Name is required."],
  },
  department: {
    type: String,
    required: [true, "Department is required."],
  },
  session_preGame: {
    type: String,
    default: "Not Arranged",
  },
  session_interGame: {
    type: Number,
    default: -1,
  },
  create_time: {
    type: Date,
    default: moment.tz(Date.now(), "Asia/Taipei"),
  },
});

const Team = mongoose.model("team", TeamSchema);

module.exports = Team;
