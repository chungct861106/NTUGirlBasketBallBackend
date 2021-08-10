const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Schema = mongoose.Schema;

const TestSchema = new Schema({
  id: {
    type: mongoose.Types.ObjectId,
  },
  name: {
    type: String,
    unique: true,
    require: [true, "Name is required"],
  },
  number: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    require: [true, "Type is required"],
  },
  url: {
    type: String,
    default: null,
  },
  create_time: {
    type: Date,
    default: moment.tz(Date.now(), "Asia/Taipei"),
  },
});

const Test = mongoose.model("Test", TestSchema);

module.exports = Test;
