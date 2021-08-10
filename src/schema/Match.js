const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  id: {
    type: mongoose.Types.ObjectId,
  },
  home: { type: mongoose.Types.ObjectId, ref: "team", required: true },
  away: { type: mongoose.Types.ObjectId, ref: "team", required: true },
  stage: { type: String, default: null },
  stage_session: { type: String, default: null },
  startDate: {
    type: Date,
    default: null,
  },
  field: {
    type: Number,
    default: null,
  },
  recorder: { type: mongoose.Types.ObjectId, ref: "user", default: null },
  create_time: {
    type: Date,
    default: moment.tz(Date.now(), "Asia/Taipei"),
  },
  winner: { type: mongoose.Types.ObjectId, ref: "team", default: null },
});

const Match = mongoose.model("Match", MatchSchema);

module.exports = Match;
