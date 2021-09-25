const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  id: {
    type: mongoose.Types.ObjectId,
  },
  home: { type: mongoose.Types.ObjectId, ref: "team", required: false },
  away: { type: mongoose.Types.ObjectId, ref: "team", required: true },
  stage: { type: String, default: "preGame" },
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
  winner: { type: String, default: null },
});

const Match = mongoose.model("match", MatchSchema);

module.exports = Match;
