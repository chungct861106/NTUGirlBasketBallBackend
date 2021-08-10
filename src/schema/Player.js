const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  id: {
    type: mongoose.Types.ObjectId,
  },
  team_id: { type: mongoose.Types.ObjectId, ref: "team", required: true },
  name: { type: String, default: null },
  studentID: { type: String, default: null },
  grade: { type: Number, default: 1 },
  create_time: {
    type: Date,
    default: moment.tz(Date.now(), "Asia/Taipei"),
  },
  number: { type: Number, default: 0 },
  photo: { type: String, default: null },
});

const Player = mongoose.model("Player", PlayerSchema);

module.exports = Player;
