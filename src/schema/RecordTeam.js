const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Schema = mongoose.Schema;

const RecordTeamSchema = new Schema({
  id: {
    type: mongoose.Types.ObjectId,
  },
  match_id: {
    type: mongoose.Types.ObjectId,
    ref: "match",
  },
  team_id: {
    type: mongoose.Types.ObjectId,
    ref: "team",
  },
  score1: {
    type: Number,
    required: [true, "Missing 2ession-1 score"],
  },
  score2: {
    type: Number,
    required: [true, "Missing session-2 score"],
  },
  score3: {
    type: Number,
    required: [true, "Missing session-3 score"],
  },
  score4: {
    type: Number,
    required: [true, "Missing session-4 score"],
  },
  foul1: {
    type: Number,
    required: [true, "Missing session-1 foul"],
  },
  foul2: {
    type: Number,
    required: [true, "Missing session-2 foul"],
  },
  foul3: {
    type: Number,
    required: [true, "Missing session-3 foul"],
  },
  foul4: {
    type: Number,
    required: [true, "Missing session-4 foul"],
  },
  stopWatch1: {
    type: Boolean,
    required: [true, "Missing session-1 stopWatch"],
  },
  stopWatch2: {
    type: Boolean,
    required: [true, "Missing session-2 stopWatch"],
  },
  stopWatch3: {
    type: Boolean,
    required: [true, "Missing session-3 stopWatch"],
  },
  stopWatch4: {
    type: Boolean,
    required: [true, "Missing session-4 stopWatch"],
  },
  stopWatch5: {
    type: Boolean,
    required: [true, "Missing session-5 stopWatch"],
  },
});

const RecordTeam = mongoose.model("recordTeam", RecordTeamSchema);
module.exports = RecordTeam;
