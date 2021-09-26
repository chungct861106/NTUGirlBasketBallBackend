const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Schema = mongoose.Schema;

const RecordPlayerSchema = new Schema({
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
  player_id: {
    type: mongoose.Types.ObjectId,
    ref: "Player",
  },
  foul: {
    type: Number,
  },
  steal: {
    type: Number,
    required: [true, "Missing steal"],
  },
  assist: {
    type: Number,
    required: [true, "Missing assist"],
  },
  block: {
    type: Number,
    required: [true, "Missing block"],
  },
  plus2: { type: Number, required: [true, "Missing plus2"] },
  plus3: { type: Number, required: [true, "Missing plus3"] },
  bankShot: { type: Number, required: [true, "Missing bankShot"] },
});

const RecordPlayer = mongoose.model("recordPlayer", RecordPlayerSchema);
module.exports = RecordPlayer;
